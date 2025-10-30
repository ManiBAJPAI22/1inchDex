import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateTradingPairDto } from './dto/create-trading-pair.dto';

@Injectable()
export class TradingPairsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTradingPair(dto: CreateTradingPairDto) {
    return await this.prisma.tradingPair.create({
      data: {
        pairId: dto.pairId,
        baseToken: dto.baseToken,
        quoteToken: dto.quoteToken,
        baseTokenAddress: dto.baseTokenAddress,
        quoteTokenAddress: dto.quoteTokenAddress,
        baseDecimals: dto.baseDecimals,
        quoteDecimals: dto.quoteDecimals,
        lastPrice: dto.lastPrice || 0,
        priceChange24h: dto.priceChange24h || 0,
        volume24h: dto.volume24h || 0,
        high24h: dto.high24h || 0,
        low24h: dto.low24h || 0,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async getAllTradingPairs() {
    return await this.prisma.tradingPair.findMany({
      where: { isActive: true },
      orderBy: { volume24h: 'desc' },
    });
  }

  async getTradingPair(pairId: string) {
    return await this.prisma.tradingPair.findUnique({
      where: { pairId },
    });
  }

  async updatePairPrice(pairId: string, price: number) {
    const pair = await this.prisma.tradingPair.findUnique({
      where: { pairId },
    });

    if (!pair) {
      throw new Error(`Trading pair ${pairId} not found`);
    }

    const priceChange = ((price - pair.lastPrice) / pair.lastPrice) * 100;

    return await this.prisma.tradingPair.update({
      where: { pairId },
      data: {
        lastPrice: price,
        priceChange24h: priceChange,
        high24h: Math.max(pair.high24h, price),
        low24h: pair.low24h === 0 ? price : Math.min(pair.low24h, price),
      },
    });
  }

  async updateVolume(pairId: string, volumeToAdd: number) {
    const pair = await this.prisma.tradingPair.findUnique({
      where: { pairId },
    });

    if (!pair) {
      throw new Error(`Trading pair ${pairId} not found`);
    }

    return await this.prisma.tradingPair.update({
      where: { pairId },
      data: {
        volume24h: pair.volume24h + volumeToAdd,
      },
    });
  }
}
