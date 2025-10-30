import { BigNumberish, BytesLike, JsonRpcSigner } from 'ethers';

export interface OrderPostDataI {
  maker: string;
  taker: string;
  exchangeProxyAddress: string;
  makerToken: string;
  takerToken: string;
  orderType: string;
  signature: string;
  makerAssetAmount: string;
  takerAssetAmount: string;
  makerAssetAmountString: string;
  takerAssetAmountString: string;
  expiry: number;
  pseudoSignature: string;
  takerTokenDecimal: string;
  makerTokenDecimal: string;
  pool: string;
  salt: string;
  makerApprovalParams?: string;
  makerRegisterSignerParams?: string;
  makerDeploySafeParams?: string;
}

interface Signature {
  signatureType: number;
  r: string;
  s: string;
  v: number;
}

interface Order {
  signature: Signature;
  sender: string;
  maker: string;
  taker: string;
  takerTokenFeeAmount: string;
  makerAmount: string;
  takerAmount: string;
  makerToken: string;
  takerToken: string;
  salt: string;
  verifyingContract: string;
  feeRecipient: string;
  expiry: string;
  chainId: number;
  pool: string;
}

interface MetaData {
  orderHash: string;
  remainingFillableTakerAmount: string;
  createdAt: string;
}

export interface ZeroXOrderRecordI {
  order: Order;
  metaData: MetaData;
}

export interface ZeroXOrderBookI {
  bids: {
    total: number;
    page: number;
    perPage: number;
    records: ZeroXOrderRecordI[];
  };
  asks: {
    total: number;
    page: number;
    perPage: number;
    records: ZeroXOrderRecordI[];
  };
}

export interface PackedUserOperation {
  sender: string;
  nonce: number;
  initCode: string;
  callData: string;
  callGasLimit: number;
  verificationGasLimit: number;
  preVerificationGas: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  paymasterAndData: string;
  signature: string;
}

export interface SafeUserOperation {
  safe: string;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  validAfter: BigNumberish;
  validUntil: BigNumberish;
  entryPoint: string;
}

export interface BuildSafeOperation {
  to: string;
  value: BigNumberish;
  data: string;
  nonce: BigNumberish;
  userAddress: string;
  safeAddress: string;
  userSigner: JsonRpcSigner;
  isInitCode: boolean;
}

export interface ReturnOrderI {
  extrData: any;
  size: number;
  price: number;
  timestamp: string;
}

export interface BuyPostDataI {
  safeAddress: any;
  token: string;
  tokenDecimal: string;
  expiry: string;
  safeDeploy?: string;
  approval?: string;
  registerSigner?: string;
}

export enum SideType {
  SIDE_NONE,
  SIDE_BUY,
  SIDE_SELL,
}

export interface CreateOrderI {
  ExtraData: string;
  Side: SideType;
  Size: number;
  LimitPrice: number;
  UserID: number;
}
