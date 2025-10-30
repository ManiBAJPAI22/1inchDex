import { LimitOrderV4Struct } from '@1inch/limit-order-sdk';
import { ethers } from 'ethers';
import ConstantProvider from '@/utils/constantProvider';

// 1inch Limit Order Protocol contract address (same across most EVM chains)
export const ONEINCH_CONTRACT_ADDRESS = ConstantProvider.ONEINCH_CONTRACT_ADDRESS || '0x111111125421ca6dc452d289314280a0f8842a65';
export const ONEINCH_API_KEY = process.env.NEXT_PUBLIC_ONEINCH_API_KEY || '';

/**
 * OneInch Service
 * Wraps the 1inch Limit Order SDK for creating, signing, and filling limit orders
 */
export class OneInchService {
  private chainId: number;

  constructor(chainId: number) {
    this.chainId = chainId;
  }

  /**
   * Create a limit order for 1inch protocol
   * @param params Order parameters
   * @returns Limit order object
   */
  async createLimitOrder(params: {
    makerAsset: string; // Token address maker is selling
    takerAsset: string; // Token address maker is buying
    makerAmount: string; // Amount maker is selling (in wei/smallest unit)
    takerAmount: string; // Amount maker wants to receive (in wei/smallest unit)
    maker: string; // Maker wallet address
    receiver?: string; // Optional receiver address (defaults to maker)
    allowedSender?: string; // Optional: restrict who can fill (address(0) = anyone)
    expiry?: number; // Unix timestamp when order expires
    nonce?: string; // Unique nonce for the order
  }): Promise<LimitOrderV4Struct> {
    const {
      makerAsset,
      takerAsset,
      makerAmount,
      takerAmount,
      maker,
      receiver = '0x0000000000000000000000000000000000000000', // address(0) means maker
      allowedSender = '0x0000000000000000000000000000000000000000', // address(0) means anyone
      expiry = Math.floor(Date.now() / 1000) + 86400, // Default 24 hours
      nonce,
    } = params;

    // Create makerTraits with expiry
    // MakerTraits encodes various order parameters including expiry
    // For simplicity, we'll encode just the expiry in the lower bits
    const makerTraits = BigInt(expiry);

    // Create the order structure
    const order: LimitOrderV4Struct = {
      salt: nonce || this.generateSalt(),
      maker: maker,
      receiver: receiver,
      makerAsset: makerAsset,
      takerAsset: takerAsset,
      makingAmount: makerAmount,
      takingAmount: takerAmount,
      makerTraits: makerTraits.toString(),
    };

    return order;
  }

  /**
   * Generate a unique salt/nonce for the order
   */
  private generateSalt(): string {
    return ethers.toBigInt(Math.floor(Math.random() * 1e16)).toString();
  }

  /**
   * Get the EIP-712 typed data for signing a limit order
   * @param order The limit order struct
   * @returns Typed data for signing
   */
  getTypedData(order: LimitOrderV4Struct) {
    return {
      types: {
        Order: [
          { name: 'salt', type: 'uint256' },
          { name: 'maker', type: 'address' },
          { name: 'receiver', type: 'address' },
          { name: 'makerAsset', type: 'address' },
          { name: 'takerAsset', type: 'address' },
          { name: 'makingAmount', type: 'uint256' },
          { name: 'takingAmount', type: 'uint256' },
          { name: 'makerTraits', type: 'uint256' },
        ],
      },
      domain: {
        name: '1inch Limit Order Protocol',
        version: '4',
        chainId: this.chainId,
        verifyingContract: ONEINCH_CONTRACT_ADDRESS,
      },
      primaryType: 'Order' as const,
      message: order,
    };
  }

  /**
   * Sign a limit order using EIP-712
   * @param order The limit order struct
   * @param signer ethers.js signer
   * @returns Signature string
   */
  async signOrder(order: LimitOrderV4Struct, signer: ethers.Signer): Promise<string> {
    const typedData = this.getTypedData(order);

    // Sign using EIP-712
    const signature = await signer.signTypedData(
      typedData.domain,
      typedData.types,
      typedData.message
    );

    return signature;
  }

  /**
   * Get the order hash for a limit order
   * @param order The limit order struct
   * @returns Order hash
   */
  getOrderHash(order: LimitOrderV4Struct): string {
    const typedData = this.getTypedData(order);

    // Calculate EIP-712 hash
    const domainSeparator = ethers.TypedDataEncoder.hashDomain(typedData.domain);
    const structHash = ethers.TypedDataEncoder.hashStruct(
      'Order',
      typedData.types,
      typedData.message
    );

    const orderHash = ethers.keccak256(
      ethers.concat(['0x1901', domainSeparator, structHash])
    );

    return orderHash;
  }

  /**
   * Check if an order is still valid (not expired)
   * @param order The limit order struct
   * @returns true if valid, false if expired
   */
  isOrderValid(order: LimitOrderV4Struct): boolean {
    // Extract expiry from makerTraits
    const makerTraits = BigInt(order.makerTraits);
    const expiry = Number((makerTraits >> BigInt(160)) & BigInt(0xFFFFFFFF));

    const currentTime = Math.floor(Date.now() / 1000);
    return expiry > currentTime;
  }

  /**
   * Parse signature into v, r, s components
   * @param signature Signature string
   * @returns Object with v, r, s
   */
  parseSignature(signature: string): { v: number; r: string; s: string } {
    const sig = ethers.Signature.from(signature);
    return {
      v: sig.v,
      r: sig.r,
      s: sig.s,
    };
  }

  /**
   * Serialize order for backend storage
   * @param order Limit order struct
   * @param signature Order signature
   * @returns JSON string
   */
  serializeOrder(order: LimitOrderV4Struct, signature: string): string {
    return JSON.stringify({
      order,
      signature,
      chainId: this.chainId,
      contractAddress: ONEINCH_CONTRACT_ADDRESS,
    });
  }

  /**
   * Deserialize order from backend storage
   * @param orderData JSON string from backend
   * @returns Order and signature
   */
  deserializeOrder(orderData: string): {
    order: LimitOrderV4Struct;
    signature: string;
    chainId: number;
    contractAddress: string;
  } {
    return JSON.parse(orderData);
  }
}

export default OneInchService;
