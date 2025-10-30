import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TradingPairsService } from './trading-pairs.service';
import { CreateTradingPairDto } from './dto/create-trading-pair.dto';

@ApiTags('trading-pairs')
@Controller('trading-pairs')
export class TradingPairsController {
  constructor(private readonly tradingPairsService: TradingPairsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active trading pairs' })
  async getAllTradingPairs() {
    return await this.tradingPairsService.getAllTradingPairs();
  }

  @Get(':pairId')
  @ApiOperation({ summary: 'Get trading pair by ID' })
  async getTradingPair(@Param('pairId') pairId: string) {
    return await this.tradingPairsService.getTradingPair(pairId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trading pair' })
  async createTradingPair(@Body() dto: CreateTradingPairDto) {
    return await this.tradingPairsService.createTradingPair(dto);
  }
}
