import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';

@ApiTags('trades')
@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trade record' })
  async createTrade(@Body() dto: CreateTradeDto) {
    return await this.tradesService.createTrade(dto);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent trades' })
  @ApiQuery({ name: 'pairId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getRecentTrades(
    @Query('pairId') pairId?: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    return await this.tradesService.getRecentTrades(pairId, limitNum);
  }

  @Get('pair/:pairId')
  @ApiOperation({ summary: 'Get trades by trading pair' })
  @ApiQuery({ name: 'limit', required: false })
  async getTradesByPair(
    @Param('pairId') pairId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    return await this.tradesService.getTradesByPair(pairId, limitNum);
  }

  @Get('user/:address')
  @ApiOperation({ summary: 'Get trades by user address' })
  @ApiQuery({ name: 'limit', required: false })
  async getUserTrades(
    @Param('address') address: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 50;
    return await this.tradesService.getUserTrades(address, limitNum);
  }

  @Get('volume/:pairId')
  @ApiOperation({ summary: 'Get 24h volume for a pair' })
  async get24hVolume(@Param('pairId') pairId: string) {
    const volume = await this.tradesService.get24hVolume(pairId);
    return { pairId, volume24h: volume };
  }
}
