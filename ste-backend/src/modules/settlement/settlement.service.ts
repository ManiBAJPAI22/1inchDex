import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers, Contract, Wallet, JsonRpcProvider } from 'ethers';
import { PrismaService } from 'src/services/prisma.service';
import { ConfigService } from '@nestjs/config';

// 1inch Limit Order Protocol ABI (minimal for fillOrder)
const LIMIT_ORDER_PROTOCOL_ABI = [
  'function fillOrder(tuple(uint256 salt, address makerAsset, address takerAsset, address maker, address receiver, address allowedSender, uint256 makingAmount, uint256 takingAmount, uint256 offsets, bytes interactions) order, bytes32 r, bytes32 vs, uint256 amount, uint256 takerTraits) external payable returns(uint256, uint256, bytes32)',
  'function remaining(bytes32 orderHash) external view returns(uint256)',
  'function cancelOrder(tuple(uint256 salt, address makerAsset, address takerAsset, address maker, address receiver, address allowedSender, uint256 makingAmount, uint256 takingAmount, uint256 offsets, bytes interactions) order) external',
];

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

interface MatchedOrder {
  id: string;
  orderId: string;
  metadata: string;
  size: number;
  price: number;
}

@Injectable()
export class SettlementService implements OnModuleInit {
  private readonly logger = new Logger(SettlementService.name);
  private wallet: Wallet;
  private provider: JsonRpcProvider;
  private limitOrderContract: Contract;
  private settlementEnabled: boolean;
  private retryAttempts: number;
  private retryDelayMs: number;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      // Initialize provider and wallet
      const rpcUrl = this.configService.get<string>('MONAD_RPC_URL');
      const privateKey = this.configService.get<string>(
        'SETTLEMENT_BOT_PRIVATE_KEY',
      );
      const contractAddress = this.configService.get<string>(
        'ONEINCH_CONTRACT_ADDRESS',
      );

      this.settlementEnabled =
        this.configService.get<string>('SETTLEMENT_ENABLED') === 'true';
      this.retryAttempts =
        parseInt(
          this.configService.get<string>('SETTLEMENT_RETRY_ATTEMPTS') || '3',
        ) || 3;
      this.retryDelayMs =
        parseInt(
          this.configService.get<string>('SETTLEMENT_RETRY_DELAY_MS') ||
            '5000',
        ) || 5000;

      if (!this.settlementEnabled) {
        this.logger.warn('⚠️  Settlement service is DISABLED');
        return;
      }

      if (!rpcUrl || !privateKey || !contractAddress) {
        this.logger.error(
          '❌ Missing settlement configuration in .env file',
        );
        this.settlementEnabled = false;
        return;
      }

      this.provider = new JsonRpcProvider(rpcUrl);
      this.wallet = new Wallet(privateKey, this.provider);
      this.limitOrderContract = new Contract(
        contractAddress,
        LIMIT_ORDER_PROTOCOL_ABI,
        this.wallet,
      );

      const balance = await this.provider.getBalance(this.wallet.address);
      this.logger.log(
        `✅ Settlement Bot initialized: ${this.wallet.address}`,
      );
      this.logger.log(
        `💰 Bot balance: ${ethers.formatEther(balance)} MON`,
      );

      if (balance === BigInt(0)) {
        this.logger.warn(
          '⚠️  WARNING: Settlement bot has 0 MON balance! Please fund the bot wallet.',
        );
      }
    } catch (error) {
      this.logger.error('❌ Failed to initialize settlement service:', error);
      this.settlementEnabled = false;
    }
  }

  /**
   * Settle matched orders on-chain
   * Called automatically after orders are matched
   */
  async settleMatchedOrders(
    matchedOrders: MatchedOrder[],
    newOrderMetadata: string,
  ): Promise<void> {
    if (!this.settlementEnabled) {
      this.logger.warn('Settlement is disabled, skipping...');
      return;
    }

    if (!matchedOrders || matchedOrders.length === 0) {
      return;
    }

    this.logger.log(
      `🔄 Processing ${matchedOrders.length} matched orders for settlement`,
    );

    for (const matchedOrder of matchedOrders) {
      try {
        await this.settleSingleTrade(matchedOrder, newOrderMetadata);
      } catch (error) {
        this.logger.error(
          `Failed to settle order ${matchedOrder.orderId}:`,
          error,
        );
      }
    }
  }

  /**
   * Settle a single trade by calling fillOrder on the 1inch contract
   */
  private async settleSingleTrade(
    matchedOrder: MatchedOrder,
    takerOrderMetadata: string,
  ): Promise<string | null> {
    try {
      // Find the trade record by maker order ID
      const trade = await this.prismaService.trade.findFirst({
        where: {
          makerOrderId: matchedOrder.orderId,
          settlementStatus: 'pending',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!trade) {
        this.logger.warn(
          `No pending trade found for order ${matchedOrder.orderId}`,
        );
        return null;
      }

      const tradeId = trade.id;

      // Get trading pair to determine token decimals
      const tradingPair = await this.prismaService.tradingPair.findUnique({
        where: { pairId: trade.pairId },
      });

      if (!tradingPair) {
        throw new Error(`Trading pair ${trade.pairId} not found`);
      }

      // Update trade status to "settling"
      await this.updateTradeStatus(tradeId, 'settling', null);

      // Parse the maker order (the matched order from order book)
      const makerOrderData = this.parseOrderMetadata(matchedOrder.metadata);
      const takerOrderData = this.parseOrderMetadata(takerOrderMetadata);

      if (!makerOrderData || !takerOrderData) {
        throw new Error('Invalid order metadata format');
      }

      this.logger.log(`📝 Settling trade ${tradeId}`);
      this.logger.log(
        `   Maker: ${makerOrderData.order.maker.substring(0, 10)}...`,
      );
      this.logger.log(
        `   Taker: ${takerOrderData.order.maker.substring(0, 10)}...`,
      );

      // Calculate the amount to fill (use the matched size)
      // The takerAmount must be in the maker's takerAsset (what maker wants to receive)
      let takerAmountValue: number;
      let takerAssetDecimals: number;

      if (trade.side === 'sell') {
        // Maker is selling base for quote
        // takerAsset = quote token, so amount = size * price (in quote)
        takerAmountValue = matchedOrder.size * matchedOrder.price;
        takerAssetDecimals = tradingPair.quoteDecimals;
        this.logger.log(
          `   Maker selling: takerAmount = ${takerAmountValue} quote tokens (${takerAssetDecimals} decimals)`,
        );
      } else {
        // Maker is buying base with quote
        // takerAsset = base token, so amount = size (in base)
        takerAmountValue = matchedOrder.size;
        takerAssetDecimals = tradingPair.baseDecimals;
        this.logger.log(
          `   Maker buying: takerAmount = ${takerAmountValue} base tokens (${takerAssetDecimals} decimals)`,
        );
      }

      const takerAmount = ethers.parseUnits(
        takerAmountValue.toString(),
        takerAssetDecimals,
      ).toString();

      // Call fillOrder on the 1inch contract
      const tx = await this.fillOrder(
        makerOrderData.order,
        makerOrderData.signature,
        takerAmount,
      );

      this.logger.log(
        `✅ Trade settled! Tx: ${tx.hash}`,
      );

      // Update trade with transaction hash and status
      await this.updateTradeStatus(tradeId, 'settled', null, tx.hash);

      return tx.hash;
    } catch (error) {
      this.logger.error(`❌ Settlement failed for order ${matchedOrder.orderId}:`, error);

      // Try to find the trade and update it with error
      const trade = await this.prismaService.trade.findFirst({
        where: {
          makerOrderId: matchedOrder.orderId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (trade) {
        const errorMessage = error.message || 'Unknown error';
        await this.updateTradeStatus(trade.id, 'failed', errorMessage);
      }

      return null;
    }
  }

  /**
   * Call fillOrder on the 1inch Limit Order Protocol contract
   */
  private async fillOrder(
    order: any,
    signature: any,
    takerAmount: string,
  ): Promise<any> {
    const takerTraits = 0; // Default: no special traits

    this.logger.log('🔗 Calling fillOrder on 1inch contract...');

    // Extract signature components
    const r = signature.r;
    const vs = signature.vs;

    // Call the smart contract
    const tx = await this.limitOrderContract.fillOrder(
      order,
      r,
      vs,
      takerAmount,
      takerTraits,
    );

    this.logger.log(`⏳ Waiting for transaction confirmation...`);
    const receipt = await tx.wait();

    return receipt;
  }

  /**
   * Parse order metadata stored in database
   */
  private parseOrderMetadata(metadata: string): {
    order: any;
    signature: any;
  } | null {
    try {
      const parsed = JSON.parse(metadata);

      if (!parsed.order || !parsed.signature) {
        return null;
      }

      // Parse signature
      const sig = ethers.Signature.from(parsed.signature);

      // Create compact 'vs' format
      const vs = this.combineVS(sig.v, sig.s);

      // Use fullOrder if available (for contract execution)
      let orderToUse = parsed.fullOrder;

      // If fullOrder doesn't exist, construct it properly from order
      if (!parsed.fullOrder && parsed.order) {
        this.logger.warn('No fullOrder in metadata, constructing from order');

        // Construct fullOrder with correct field order and structure
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

      // Validate that orderToUse has all required fields
      if (!orderToUse.allowedSender) {
        this.logger.error('Order is missing required fields. Order structure:', orderToUse);
        throw new Error('Invalid order structure: missing allowedSender');
      }

      return {
        order: orderToUse,
        signature: {
          signature: parsed.signature,
          r: sig.r,
          s: sig.s,
          v: sig.v,
          vs: vs,
        },
      };
    } catch (error) {
      this.logger.error('Failed to parse order metadata:', error);
      return null;
    }
  }

  /**
   * Combine v and s into compact 'vs' format (used by 1inch)
   */
  private combineVS(v: number, s: string): string {
    const sBigInt = BigInt(s);
    const vAdjusted = BigInt(v - 27);
    const vs = sBigInt | (vAdjusted << BigInt(255));
    return '0x' + vs.toString(16).padStart(64, '0');
  }

  /**
   * Update trade settlement status in database
   */
  private async updateTradeStatus(
    tradeId: string,
    status: string,
    error: string | null,
    txHash?: string,
  ): Promise<void> {
    await this.prismaService.trade.update({
      where: { id: tradeId },
      data: {
        settlementStatus: status,
        settlementError: error,
        txHash: txHash || undefined,
        settledAt: status === 'settled' ? new Date() : undefined,
      },
    });
  }

  /**
   * Retry settlement for failed trades
   */
  async retryFailedSettlements(): Promise<void> {
    if (!this.settlementEnabled) {
      return;
    }

    const failedTrades = await this.prismaService.trade.findMany({
      where: {
        settlementStatus: 'failed',
      },
      take: 10, // Process 10 at a time
    });

    if (failedTrades.length === 0) {
      return;
    }

    this.logger.log(
      `🔄 Retrying ${failedTrades.length} failed settlements...`,
    );

    for (const trade of failedTrades) {
      // Get the orders from order book
      const makerOrder = await this.prismaService.orderBook.findUnique({
        where: { orderId: trade.makerOrderId },
      });

      const takerOrder = await this.prismaService.orderBook.findUnique({
        where: { orderId: trade.takerOrderId },
      });

      if (!makerOrder || !takerOrder) {
        this.logger.warn(
          `Skipping trade ${trade.id} - orders not found`,
        );
        continue;
      }

      try {
        await this.settleSingleTrade(
          {
            id: trade.id,
            orderId: makerOrder.orderId,
            metadata: makerOrder.metadata,
            size: trade.amount,
            price: trade.price,
          },
          takerOrder.metadata,
        );
      } catch (error) {
        this.logger.error(
          `Failed to retry settlement for trade ${trade.id}:`,
          error,
        );
      }

      // Wait between retries
      await this.sleep(this.retryDelayMs);
    }
  }

  /**
   * Get settlement statistics
   */
  async getSettlementStats(): Promise<any> {
    const stats = await this.prismaService.trade.groupBy({
      by: ['settlementStatus'],
      _count: true,
    });

    return stats;
  }

  /**
   * Check bot balance
   */
  async getBotBalance(): Promise<string> {
    if (!this.wallet) {
      return '0';
    }

    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
