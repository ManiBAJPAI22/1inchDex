import { Contract, ethers } from 'ethers';
import assert from 'assert';
import ConstantProvider from '../utils/constantProvider';
import { ONEINCH_LIMIT_ORDER_PROTOCOL_ABI, ERC20_ABI } from '../utils/tradeABI';
import { useAccount } from 'wagmi';
import { useEthersProvider, useEthersSigner } from '@/lib/etherAdapter';
import { LimitOrderV4Struct, MakerTraits } from '@1inch/limit-order-sdk';
import OneInchService from '@/services/oneinch';
import { useMemo } from 'react';

export enum OrderType {
  LIMIT = 'LIMIT',
}

export interface CreateOrderProps {
  maker: string;
  taker?: string; // Optional: address(0) means anyone can fill
  makerToken: string;
  takerToken: string;
  makerAssetAmount: bigint;
  takerAssetAmount: bigint;
  expiryUnixTimestamp?: bigint; // Optional: defaults to 24 hours
}

export interface OrderSignature {
  signature: string;
  r: string;
  s: string;
  v: number;
  vs: string; // Compact signature format used by 1inch
}

export interface SignedOrder {
  order: LimitOrderV4Struct;
  signature: OrderSignature;
  orderHash: string;
}

export function useTrade() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const oneInchContractAddress = ConstantProvider.ONEINCH_CONTRACT_ADDRESS;
  const chainId = ConstantProvider.NETWORK_CHAIN_ID;

  // Initialize 1inch service with explicit contract address - memoized to avoid recreating on every render
  const oneInchService = useMemo(
    () => new OneInchService(chainId, oneInchContractAddress),
    [chainId, oneInchContractAddress]
  );

  // Approve token spending for 1inch router
  const approveToken = async ({
    tokenAddress,
    spender = oneInchContractAddress,
    amount = ethers.MaxUint256,
  }: {
    tokenAddress: string;
    spender?: string;
    amount?: bigint;
  }) => {
    assert(signer, 'Signer is not available. Please connect your wallet.');

    console.log('Approving token for 1inch:', { tokenAddress, spender, amount: amount.toString() });

    const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);

    const tx = await tokenContract.approve(spender, amount);
    const receipt = await tx.wait();

    console.log('Token approved:', receipt.hash);
    return receipt;
  };

  // Check token allowance
  const checkAllowance = async ({
    tokenAddress,
    owner,
    spender = oneInchContractAddress,
  }: {
    tokenAddress: string;
    owner: string;
    spender?: string;
  }): Promise<bigint> => {
    assert(provider, 'Provider is not available');

    console.log('Checking allowance:', { tokenAddress, owner, spender });

    const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);

    const allowance = await tokenContract.allowance(owner, spender);
    return BigInt(allowance.toString());
  };

  // Check token balance
  const checkBalance = async ({
    tokenAddress,
    owner,
  }: {
    tokenAddress: string;
    owner: string;
  }): Promise<bigint> => {
    assert(provider, 'Provider is not available');

    const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);

    const balance = await tokenContract.balanceOf(owner);
    return BigInt(balance.toString());
  };

  // Create a 1inch limit order
  const createOrder = async ({
    maker,
    taker = ethers.ZeroAddress, // address(0) means anyone can fill
    makerToken,
    takerToken,
    makerAssetAmount,
    takerAssetAmount,
    expiryUnixTimestamp,
  }: CreateOrderProps): Promise<SignedOrder> => {
    assert(signer, 'Signer is not available. Please connect your wallet.');
    assert(provider, 'Provider is not available');

    // Default expiry: 24 hours from now
    const expiry = expiryUnixTimestamp
      ? Number(expiryUnixTimestamp)
      : Math.floor(Date.now() / 1000) + 86400;

    console.log('Creating 1inch limit order:', {
      maker,
      taker,
      makerToken,
      takerToken,
      makerAssetAmount: makerAssetAmount.toString(),
      takerAssetAmount: takerAssetAmount.toString(),
      expiry,
    });

    // Create the order using 1inch service
    const order = await oneInchService.createLimitOrder({
      makerAsset: makerToken,
      takerAsset: takerToken,
      makerAmount: makerAssetAmount.toString(),
      takerAmount: takerAssetAmount.toString(),
      maker,
      receiver: ethers.ZeroAddress, // address(0) means maker receives
      allowedSender: taker, // address(0) means anyone can fill
      expiry,
    });

    // Sign the order using EIP-712
    const signature = await oneInchService.signOrder(order, signer);

    // Parse signature into components
    const sig = oneInchService.parseSignature(signature);

    // Create compact 'vs' signature (v + s combined) used by 1inch
    const vs = combineVS(sig.v, sig.s);

    // Get order hash
    const orderHash = oneInchService.getOrderHash(order);

    console.log('Order created and signed:', {
      orderHash,
      signature: { v: sig.v, r: sig.r, s: sig.s, vs },
    });

    return {
      order,
      signature: {
        signature,
        r: sig.r,
        s: sig.s,
        v: sig.v,
        vs,
      },
      orderHash,
    };
  };

  // Combine v and s into compact 'vs' format (used by 1inch)
  const combineVS = (v: number, s: string): string => {
    // vs = s + (v - 27) * 2^255
    const sBigInt = BigInt(s);
    const vAdjusted = BigInt(v - 27);
    const vs = sBigInt | (vAdjusted << BigInt(255));
    return '0x' + vs.toString(16).padStart(64, '0');
  };

  // Check how much of an order remains unfilled
  const checkOrderRemaining = async (orderHash: string): Promise<bigint> => {
    assert(provider, 'Provider is not available');

    const limitOrderContract = new Contract(
      oneInchContractAddress,
      ONEINCH_LIMIT_ORDER_PROTOCOL_ABI,
      provider
    );

    const remaining = await limitOrderContract.remaining(orderHash);
    return BigInt(remaining.toString());
  };

  // Fill a 1inch limit order
  const fillOrder = async ({
    order,
    signature,
    takerAmount,
  }: {
    order: LimitOrderV4Struct;
    signature: OrderSignature;
    takerAmount: bigint;
  }): Promise<any> => {
    assert(signer, 'Signer is not available. Please connect your wallet.');
    assert(provider, 'Provider is not available');

    // Normalize order to ensure addresses are in proper format
    // Handles both old format (uint256) and new format (addresses)
    const normalizedOrder = oneInchService.normalizeOrder(order);

    console.log('🔍 DETAILED fillOrder DEBUG:');
    console.log('Order structure (normalized):', {
      salt: normalizedOrder.salt,
      maker: normalizedOrder.maker,
      receiver: normalizedOrder.receiver,
      makerAsset: normalizedOrder.makerAsset,
      takerAsset: normalizedOrder.takerAsset,
      makingAmount: normalizedOrder.makingAmount,
      takingAmount: normalizedOrder.takingAmount,
      makerTraits: normalizedOrder.makerTraits,
    });
    console.log('Signature components:', {
      r: signature.r,
      vs: signature.vs,
      fullSignature: signature.signature,
    });
    console.log('Fill parameters:', {
      takerAmount: takerAmount.toString(),
      takerAmountBigInt: takerAmount,
      takerTraits: 0,
    });

    const takerAddress = await signer.getAddress();
    console.log('Taker address:', takerAddress);

    const limitOrderContract = new Contract(
      oneInchContractAddress,
      ONEINCH_LIMIT_ORDER_PROTOCOL_ABI,
      signer
    );

    // Get order hash for logging (using normalized order with addresses)
    const orderHash = oneInchService.getOrderHash(normalizedOrder);
    console.log('Order hash:', orderHash);

    // Convert order to contract format (addresses as uint256)
    const orderForContract = oneInchService.convertOrderForContract(normalizedOrder);
    console.log('Order converted to contract format (uint256 addresses)');

    // TakerTraits: 0 for default behavior (no special flags)
    const takerTraits = 0;

    console.log('📞 Calling fillOrder on contract...');
    console.log('Contract address:', oneInchContractAddress);
    console.log('Parameters:', [orderForContract, signature.r, signature.vs, takerAmount.toString(), takerTraits]);

    // Call fillOrder with the compact signature format (r, vs)
    // The contract will revert if there are any issues with balances/allowances
    const tx = await limitOrderContract.fillOrder(
      orderForContract,
      signature.r,
      signature.vs,
      takerAmount,
      takerTraits
    );

    console.log('✅ Transaction sent! Waiting for confirmation...');
    const receipt = await tx.wait();

    console.log('✅ Order filled successfully!', {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });

    return receipt;
  };

  // Cancel a 1inch limit order
  const cancelOrder = async (order: LimitOrderV4Struct): Promise<any> => {
    assert(signer, 'Signer is not available. Please connect your wallet.');

    console.log('Canceling 1inch order:', order);

    const limitOrderContract = new Contract(
      oneInchContractAddress,
      ONEINCH_LIMIT_ORDER_PROTOCOL_ABI,
      signer
    );

    // Normalize order to ensure addresses are in proper format
    const normalizedOrder = oneInchService.normalizeOrder(order);

    // Convert order to contract format (addresses as uint256)
    const orderForContract = oneInchService.convertOrderForContract(normalizedOrder);

    const tx = await limitOrderContract.cancelOrder(orderForContract);
    const receipt = await tx.wait();

    console.log('Order canceled:', receipt.hash);
    return receipt;
  };

  // Reconstruct order from metadata (for filling matched orders)
  const reconstructOrder = (metadata: string): {
    order: LimitOrderV4Struct;
    signature: OrderSignature;
  } => {
    const parsed = JSON.parse(metadata);

    // Validate it's a 1inch order
    if (!parsed.order || !parsed.signature) {
      throw new Error('Invalid order metadata format');
    }

    // Use fullOrder for contract execution (has allowedSender, offsets, interactions)
    // The simplified 'order' is only used for EIP-712 signing
    let orderToUse = parsed.fullOrder;

    // Fallback: If fullOrder doesn't exist, construct it from order
    if (!orderToUse && parsed.order) {
      console.warn('No fullOrder in metadata, constructing from order');
      orderToUse = {
        salt: parsed.order.salt,
        makerAsset: parsed.order.makerAsset,
        takerAsset: parsed.order.takerAsset,
        maker: parsed.order.maker,
        receiver: parsed.order.receiver || ethers.ZeroAddress,
        allowedSender: ethers.ZeroAddress, // Anyone can fill
        makingAmount: parsed.order.makingAmount,
        takingAmount: parsed.order.takingAmount,
        offsets: '0',
        interactions: '0x',
      };
    }

    const sig = oneInchService.parseSignature(parsed.signature);
    const vs = combineVS(sig.v, sig.s);

    return {
      order: orderToUse,
      signature: {
        signature: parsed.signature,
        r: sig.r,
        s: sig.s,
        v: sig.v,
        vs,
      },
    };
  };

  // Serialize order for backend storage
  const serializeOrder = (order: LimitOrderV4Struct, signature: string): string => {
    return oneInchService.serializeOrder(order, signature);
  };

  // Check if order is still valid (not expired)
  const isOrderValid = (order: LimitOrderV4Struct): boolean => {
    return oneInchService.isOrderValid(order);
  };

  // Get order hash
  const getOrderHash = (order: LimitOrderV4Struct): string => {
    return oneInchService.getOrderHash(order);
  };

  // Get token decimals
  const getTokenDecimals = async (tokenAddress: string): Promise<number> => {
    assert(provider, 'Provider is not available');

    const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
    const decimals = await tokenContract.decimals();
    return Number(decimals);
  };

  // Format amount with decimals
  const formatAmount = (amount: bigint, decimals: number): string => {
    return ethers.formatUnits(amount, decimals);
  };

  // Parse amount with decimals
  const parseAmount = (amount: string, decimals: number): bigint => {
    return ethers.parseUnits(amount, decimals);
  };

  return {
    // Token operations
    approveToken,
    checkAllowance,
    checkBalance,
    getTokenDecimals,
    formatAmount,
    parseAmount,

    // Order operations
    createOrder,
    fillOrder,
    cancelOrder,
    checkOrderRemaining,
    isOrderValid,
    getOrderHash,

    // Serialization helpers
    serializeOrder,
    reconstructOrder,

    // Contract addresses
    oneInchContractAddress,
    chainId,
  };
}
