import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [SettlementController],
  providers: [SettlementService, PrismaService],
  exports: [SettlementService],
})
export class SettlementModule {}
