import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/services/prisma.service';
import { TradesModule } from '../trades/trades.module';
import { TradingPairsModule } from '../tradingPairs/trading-pairs.module';
import { SettlementModule } from '../settlement/settlement.module';

@Module({
  imports: [TradesModule, TradingPairsModule, SettlementModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
  exports: [OrderService],
})
export class OrderModule {}
