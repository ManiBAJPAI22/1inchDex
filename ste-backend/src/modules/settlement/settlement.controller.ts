import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettlementService } from './settlement.service';

@ApiTags('settlement')
@Controller('settlement')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get settlement statistics' })
  async getSettlementStats() {
    return await this.settlementService.getSettlementStats();
  }

  @Get('bot-balance')
  @ApiOperation({ summary: 'Get settlement bot MON balance' })
  async getBotBalance() {
    const balance = await this.settlementService.getBotBalance();
    return {
      address: process.env.SETTLEMENT_BOT_ADDRESS,
      balance: balance,
      currency: 'MON',
    };
  }

  @Post('retry-failed')
  @ApiOperation({ summary: 'Retry failed settlements' })
  async retryFailedSettlements() {
    await this.settlementService.retryFailedSettlements();
    return {
      message: 'Failed settlements retry initiated',
    };
  }
}
