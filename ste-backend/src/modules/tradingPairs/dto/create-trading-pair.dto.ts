import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTradingPairDto {
  @ApiProperty({ example: 'BTC-USDT' })
  @IsString()
  pairId: string;

  @ApiProperty({ example: 'BTC' })
  @IsString()
  baseToken: string;

  @ApiProperty({ example: 'USDT' })
  @IsString()
  quoteToken: string;

  @ApiProperty({ example: '0x06fec110ea106BC80A3982773A2FDA92831a2dFD' })
  @IsString()
  baseTokenAddress: string;

  @ApiProperty({ example: '0x85d6758E614605e2D27711e9fDeEae50DFe1592f' })
  @IsString()
  quoteTokenAddress: string;

  @ApiProperty({ example: 18 })
  @IsNumber()
  baseDecimals: number;

  @ApiProperty({ example: 18 })
  @IsNumber()
  quoteDecimals: number;

  @ApiProperty({ example: 43250.50, required: false })
  @IsOptional()
  @IsNumber()
  lastPrice?: number;

  @ApiProperty({ example: 2.45, required: false })
  @IsOptional()
  @IsNumber()
  priceChange24h?: number;

  @ApiProperty({ example: 622600, required: false })
  @IsOptional()
  @IsNumber()
  volume24h?: number;

  @ApiProperty({ example: 43800, required: false })
  @IsOptional()
  @IsNumber()
  high24h?: number;

  @ApiProperty({ example: 42100, required: false })
  @IsOptional()
  @IsNumber()
  low24h?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

