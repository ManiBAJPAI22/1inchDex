import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrade(dto: CreateTradeDto) {
    return await this.prisma.trade.create({
      data: {
        pairId: dto.pairId,
        price: dto.price,
        amount: dto.amount,
        side: dto.side,
        makerAddress: dto.makerAddress,
        takerAddress: dto.takerAddress,
        makerOrderId: dto.makerOrderId,
        takerOrderId: dto.takerOrderId,
        txHash: dto.txHash,
      },
    });
  }

  async getRecentTrades(pairId?: string, limit: number = 50) {
    const where = pairId ? { pairId } : {};

    return await this.prisma.trade.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getTradesByPair(pairId: string, limit: number = 50) {
    return await this.prisma.trade.findMany({
      where: { pairId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserTrades(userAddress: string, limit: number = 50) {
    return await this.prisma.trade.findMany({
      where: {
        OR: [
          { makerAddress: userAddress },
          { takerAddress: userAddress },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async get24hVolume(pairId: string): Promise<number> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trades = await this.prisma.trade.findMany({
      where: {
        pairId,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    return trades.reduce((sum, trade) => sum + trade.amount * trade.price, 0);
  }
}

