import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTradingPairDto {
  @ApiProperty({ example: 'MBTC-MUSDT' })
  @IsString()
  pairId: string;

  @ApiProperty({ example: 'MBTC' })
  @IsString()
  baseToken: string;

  @ApiProperty({ example: 'MUSDT' })
  @IsString()
  quoteToken: string;

  @ApiProperty({ example: '0xbFf4bfF3ef603ef102c1db5634353691EBe5948E' })
  @IsString()
  baseTokenAddress: string;

  @ApiProperty({ example: '0x3CDF19aD4e2656269aAE1b8AC8E932D66cDd0443' })
  @IsString()
  quoteTokenAddress: string;

  @ApiProperty({ example: 18 })
  @IsNumber()
  baseDecimals: number;

  @ApiProperty({ example: 6 })
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

