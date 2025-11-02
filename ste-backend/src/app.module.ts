import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/orderBook/order.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { TradingPairsModule } from './modules/tradingPairs/trading-pairs.module';
import { TradesModule } from './modules/trades/trades.module';
import { SettlementModule } from './modules/settlement/settlement.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrderModule,
    AuthModule,
    TradingPairsModule,
    TradesModule,
    SettlementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
