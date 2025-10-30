import { Module } from '@nestjs/common';
import { OrderModule } from './modules/orderBook/order.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { TradingPairsModule } from './modules/tradingPairs/trading-pairs.module';
import { TradesModule } from './modules/trades/trades.module';

@Module({
  imports: [OrderModule, AuthModule, TradingPairsModule, TradesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
