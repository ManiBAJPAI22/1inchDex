import { LimitOrderV4Struct, MakerTraits } from '@1inch/limit-order-sdk';
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
  private contractAddress: string;

  constructor(chainId: number, contractAddress?: string) {
    this.chainId = chainId;
    // Use the provided contract address or fall back to the constant
    this.contractAddress = contractAddress || ONEINCH_CONTRACT_ADDRESS;

    console.log('🔧 OneInchService initialized:', {
      chainId: this.chainId,
      contractAddress: this.contractAddress,
    });
  }

  /**
   * Create a limit order for 1inch protocol
   * @param params Order parameters
   * @returns Limit order object (fullOrder format for contract execution)
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
  }): Promise<any> {
    const {
      makerAsset,
      takerAsset,
      makerAmount,
      takerAmount,
      maker,
      receiver = '0x0000000000000000000000000000000000000000', // address(0) means maker
      expiry = Math.floor(Date.now() / 1000) + 86400, // Default 24 hours
      nonce,
    } = params;

    // Generate a random salt if not provided
    const salt = nonce || this.generateSalt();

    // Build makerTraits using 1inch SDK
    // This properly encodes expiration, nonce, and other order flags
    const UINT_40_MAX = (1n << 40n) - 1n;
    const orderNonce = BigInt(salt) % UINT_40_MAX; // Ensure nonce fits in uint40

    const makerTraits = MakerTraits.default()
      .withExpiration(BigInt(expiry))
      .withNonce(orderNonce)
      .asBigInt();

    console.log('📦 MakerTraits encoded:', {
      expiry,
      nonce: orderNonce.toString(),
      makerTraits: makerTraits.toString(),
    });

    // Create the 1inch V4 order structure
    // For EIP-712 signing, we keep addresses as address type (not uint256)
    // For contract calls, we'll convert to uint256 separately
    const order = {
      salt: salt,
      maker: maker,          // Keep as address for signing
      receiver: receiver,    // Keep as address for signing
      makerAsset: makerAsset, // Keep as address for signing
      takerAsset: takerAsset, // Keep as address for signing
      makingAmount: makerAmount,
      takingAmount: takerAmount,
      makerTraits: makerTraits.toString(),
    };

    return order;
  }

  /**
   * Convert order with addresses to uint256 format for contract calls
   * @param order Order with address fields as strings
   * @returns Order with address fields as uint256 strings
   */
  convertOrderForContract(order: any): any {
    const addressToUint256 = (addr: string): string => {
      return ethers.toBigInt(addr).toString();
    };

    return {
      salt: order.salt,
      maker: addressToUint256(order.maker),
      receiver: addressToUint256(order.receiver),
      makerAsset: addressToUint256(order.makerAsset),
      takerAsset: addressToUint256(order.takerAsset),
      makingAmount: order.makingAmount,
      takingAmount: order.takingAmount,
      makerTraits: order.makerTraits,
    };
  }

  /**
   * Normalize order to ensure addresses are in proper format (0x...)
   * Handles both old format (uint256) and new format (addresses)
   * @param order Order that may have uint256 or address fields
   * @returns Order with address fields as proper address strings
   */
  normalizeOrder(order: any): any {
    const uint256ToAddress = (value: string): string => {
      // If it's already an address (starts with 0x and is 42 chars), return as-is
      if (value.startsWith('0x') && value.length === 42) {
        return value;
      }
      // If it's a uint256 string, convert to address
      if (!value.startsWith('0x')) {
        const bn = ethers.toBigInt(value);
        return ethers.getAddress(ethers.toBeHex(bn, 20));
      }
      return value;
    };

    return {
      salt: order.salt,
      maker: uint256ToAddress(order.maker),
      receiver: uint256ToAddress(order.receiver),
      makerAsset: uint256ToAddress(order.makerAsset),
      takerAsset: uint256ToAddress(order.takerAsset),
      makingAmount: order.makingAmount,
      takingAmount: order.takingAmount,
      makerTraits: order.makerTraits,
    };
  }

  /**
   * Generate a unique salt/nonce for the order
   */
  private generateSalt(): string {
    // Use timestamp + random to ensure uniqueness
    // Keep it within safe integer range to avoid overflow
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e6);
    return (timestamp * 1e6 + random).toString();
  }

  /**
   * Get the EIP-712 typed data for signing a limit order
   * @param order The limit order struct (must be fullOrder format for signature to validate)
   * @returns Typed data for signing
   */
  getTypedData(order: any) {
    console.log('🔐 Creating EIP-712 typed data:', {
      chainId: this.chainId,
      verifyingContract: this.contractAddress,
      orderSalt: order.salt,
      orderMaker: order.maker,
    });

    return {
      types: {
        Order: [
          { name: 'salt', type: 'uint256' },
          { name: 'maker', type: 'address' },          // EIP-712 uses address type
          { name: 'receiver', type: 'address' },       // EIP-712 uses address type
          { name: 'makerAsset', type: 'address' },     // EIP-712 uses address type
          { name: 'takerAsset', type: 'address' },     // EIP-712 uses address type
          { name: 'makingAmount', type: 'uint256' },
          { name: 'takingAmount', type: 'uint256' },
          { name: 'makerTraits', type: 'uint256' },
        ],
      },
      domain: {
        name: '1inch Limit Order Protocol',
        version: '4',
        chainId: this.chainId,
        verifyingContract: this.contractAddress,
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
   * @returns true if valid (expiry not implemented in current version)
   */
  isOrderValid(order: any): boolean {
    // TODO: Implement expiry checking if needed
    // For now, all orders are considered valid
    return true;
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
   * @param order Limit order struct (fullOrder format)
   * @param signature Order signature
   * @returns JSON string
   */
  serializeOrder(order: any, signature: string): string {
    // Order is already in fullOrder format (with allowedSender, offsets, interactions)
    return JSON.stringify({
      order, // For backward compatibility
      fullOrder: order, // Full format for contract execution (same as order now)
      signature,
      chainId: this.chainId,
      contractAddress: this.contractAddress, // Use instance variable for consistency
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
