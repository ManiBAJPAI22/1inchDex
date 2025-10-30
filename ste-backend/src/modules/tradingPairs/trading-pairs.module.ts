import { Module } from '@nestjs/common';
import { TradingPairsController } from './trading-pairs.controller';
import { TradingPairsService } from './trading-pairs.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [TradingPairsController],
  providers: [TradingPairsService, PrismaService],
  exports: [TradingPairsService],
})
export class TradingPairsModule {}

