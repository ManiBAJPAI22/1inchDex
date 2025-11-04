import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderBook } from 'nodejs-order-book';
import { PrismaService } from 'src/services/prisma.service';
import { TradesService } from '../trades/trades.service';
import { TradingPairsService } from '../tradingPairs/trading-pairs.service';
import { SettlementService } from '../settlement/settlement.service';

@Injectable()
export class OrderService {
  private orderBookInstance: OrderBook;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tradesService: TradesService,
    private readonly tradingPairsService: TradingPairsService,
    private readonly settlementService: SettlementService,
  ) {
    this.orderBookInstance = new OrderBook();
  }

  private async getOrderBookInstance() {
    const orderBookAudit = await this.prismaService.orderBookAudit.findUnique({
      where: { id: 1 },
    });

    if (!orderBookAudit) {
      return new OrderBook({
        enableJournaling: true,
      });
    }

    const { journal, snapshot } = orderBookAudit;

    return new OrderBook({
      snapshot: snapshot as any,
      journal: journal as any,
      enableJournaling: true,
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const pairId = createOrderDto.pairId || 'MBTC-MUSDT';
    const userAddress = createOrderDto.userAddress || 'unknown';

    console.log({ pairId, userAddress }, 'createOrder');

    await this.prismaService.orderBook.create({
      data: {
        orderId: createOrderDto.orderId,
        metadata: createOrderDto.metadata,
        side: createOrderDto.side,
        size: createOrderDto.size,
        price: createOrderDto.price,
        pairId,
        userAddress,
        status: 'open',
        filledSize: 0,
      },
    });

    console.log({ createOrderDto }, 'createOrderDto after create');

    // const orderBook = this.orderBookInstance;
    const orderBook = await this.getOrderBookInstance();

    console.log({
      id: createOrderDto.orderId,
      side: createOrderDto.side,
      size: createOrderDto.size,
      price: createOrderDto.price,
    });

    const order = orderBook.limit({
      id: createOrderDto.orderId,
      side: createOrderDto.side,
      size: createOrderDto.size,
      price: createOrderDto.price,
    });

    const snapshot = orderBook.snapshot();

    const log = order.log;

    const orderBookAudit = await this.prismaService.orderBookAudit.findUnique({
      where: { id: 1 },
      select: {
        journal: true,
      },
    });

    let journal: any[] = [];

    if (log) {
      const existingJournal = orderBookAudit?.journal || [];
      journal = [...existingJournal, log];
    }

    await this.prismaService.orderBookAudit.upsert({
      where: { id: 1 },
      create: {
        id: 1, // Explicitly set id to 1 when creating
        journal: journal,
        snapshot: snapshot as any,
      },
      update: {
        journal: journal,
        snapshot: snapshot as any,
      },
    });

    // Fetch matched order metadata for on-chain execution
    const matchedOrdersWithMetadata =
      await this.getMatchedOrdersMetadata(order);

    // Record trades for matched orders
    await this.recordMatchedTrades(order, createOrderDto, pairId, userAddress);

    // Update trading pair price and volume
    if (order.done && order.done.length > 0) {
      await this.tradingPairsService.updatePairPrice(
        pairId,
        createOrderDto.price,
      );
      const volumeToAdd = order.done.reduce(
        (sum: number, o: any) => sum + o.size * o.price,
        0,
      );
      await this.tradingPairsService.updateVolume(pairId, volumeToAdd);

      // Trigger automatic settlement for matched orders
      console.log('🔄 Triggering automatic settlement for matched orders...');
      this.settlementService
        .settleMatchedOrders(matchedOrdersWithMetadata, createOrderDto.metadata)
        .catch((error: any) => {
          console.error('Settlement error (will retry later):', error);
        });
    }

    return {
      ...order,
      matchedOrders: matchedOrdersWithMetadata,
    };
  }

  // Record trades when orders are matched
  private async recordMatchedTrades(
    matchResult: any,
    newOrder: CreateOrderDto,
    pairId: string,
    userAddress: string,
  ) {
    // Record fully matched orders
    if (matchResult.done && Array.isArray(matchResult.done)) {
      for (const doneOrder of matchResult.done) {
        const makerOrderData = await this.prismaService.orderBook.findUnique({
          where: { orderId: doneOrder.id },
        });

        if (makerOrderData) {
          // IMPORTANT: In trading terminology:
          // - MAKER = the resting order already in the book (doneOrder)
          // - TAKER = the incoming new order that matches (newOrder)
          await this.tradesService.createTrade({
            pairId,
            price: doneOrder.price,
            amount: doneOrder.size,
            side: makerOrderData.side, // Use maker's side (the resting order)
            makerAddress: makerOrderData.userAddress, // Maker = resting order owner
            takerAddress: userAddress, // Taker = new order owner
            makerOrderId: doneOrder.id, // Maker = resting order
            takerOrderId: newOrder.orderId, // Taker = new order
          });

          // Update matched order status to filled
          await this.prismaService.orderBook.update({
            where: { orderId: doneOrder.id },
            data: {
              status: 'filled',
              filledSize: doneOrder.size,
            },
          });
        }
      }
    }

    // Update partial match
    if (matchResult.partial && matchResult.partialQuantityProcessed > 0) {
      const partialOrderData = await this.prismaService.orderBook.findUnique({
        where: { orderId: matchResult.partial.id },
      });

      if (partialOrderData) {
        await this.prismaService.orderBook.update({
          where: { orderId: matchResult.partial.id },
          data: {
            filledSize: matchResult.partialQuantityProcessed,
            status: matchResult.partial.size > 0 ? 'open' : 'filled',
          },
        });
      }
    }
  }

  // Get metadata for matched orders to enable on-chain execution
  private async getMatchedOrdersMetadata(matchResult: any) {
    const matchedOrders = [];

    console.log({ matchResult }, 'matchResult');

    // Get fully matched orders (done)
    if (matchResult.done && Array.isArray(matchResult.done)) {
      for (const doneOrder of matchResult.done) {
        const orderData = await this.prismaService.orderBook.findUnique({
          where: { orderId: doneOrder.id },
        });

        if (orderData) {
          // Use database data as the source of truth, with size/price from matching engine
          matchedOrders.push({
            id: orderData.orderId,
            orderId: orderData.orderId,
            side: orderData.side, // Use side from database, not matching engine
            price: doneOrder.price,
            size: doneOrder.size,
            metadata: orderData.metadata,
          });
        }
      }
    }

    // Get partial matched order
    if (matchResult.partial) {
      const orderData = await this.prismaService.orderBook.findUnique({
        where: { orderId: matchResult.partial.id },
      });

      if (orderData) {
        matchResult.partial.metadata = orderData.metadata;
        matchResult.partial.orderId = orderData.orderId;
        matchResult.partial.side = orderData.side; // Add side from database
      }
    }

    return matchedOrders;
  }

  async getOrderHistory() {
    const allOrders = await this.prismaService.orderBook.findMany();
    const openOrders = await this.getMatchEngineOrder();

    const stores = [];

    for (const allOrder of allOrders) {
      let orderStatus = 'Filled';
      for (let i = 0; i < openOrders.length; i++) {
        const openOrder = openOrders[i];
        if (allOrder.orderId === openOrder.id) {
          orderStatus = 'Pending';
        }
      }
      stores.push({ ...allOrder, orderStatus });
    }

    return stores;
  }

  async getUserOrders(userAddress: string) {
    return await this.prismaService.orderBook.findMany({
      where: { userAddress },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOpenOrders(userAddress?: string, pairId?: string) {
    const where: any = { status: 'open' };

    if (userAddress) {
      where.userAddress = userAddress;
    }

    if (pairId) {
      where.pairId = pairId;
    }

    return await this.prismaService.orderBook.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderBook(pairId: string) {
    const openOrders = await this.prismaService.orderBook.findMany({
      where: {
        pairId,
        status: 'open',
      },
      orderBy: { price: 'desc' },
    });

    // Separate into bids and asks
    const bids = openOrders
      .filter((order) => order.side === 'buy')
      .map((order) => ({
        price: order.price,
        amount: order.size - order.filledSize,
        total: (order.size - order.filledSize) * order.price,
      }))
      .sort((a, b) => b.price - a.price); // Highest first

    const asks = openOrders
      .filter((order) => order.side === 'sell')
      .map((order) => ({
        price: order.price,
        amount: order.size - order.filledSize,
        total: (order.size - order.filledSize) * order.price,
      }))
      .sort((a, b) => a.price - b.price); // Lowest first

    return {
      bids: bids.slice(0, 20), // Top 20 bids
      asks: asks.slice(0, 20), // Top 20 asks
    };
  }

  async getMatchEngineOrder() {
    const orderBook = await this.getOrderBookInstance();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const orders = orderBook.orders;
    const allOrders = Object.values(orders).map((order: any) => ({
      id: order._id,
      side: order._side,
      price: order._price,
      size: order._size,
      time: order._time,
      isMaker: order._isMaker,
    }));
    return allOrders;
  }
}
