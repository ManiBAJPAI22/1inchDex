import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTradeDto {
  @ApiProperty({ example: 'MBTC-MUSDT' })
  @IsString()
  pairId: string;

  @ApiProperty({ example: 43250.50 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'buy' })
  @IsString()
  side: string;

  @ApiProperty({ example: '0x...' })
  @IsString()
  makerAddress: string;

  @ApiProperty({ example: '0x...' })
  @IsString()
  takerAddress: string;

  @ApiProperty({ example: 'order-123' })
  @IsString()
  makerOrderId: string;

  @ApiProperty({ example: 'order-456' })
  @IsString()
  takerOrderId: string;

  @ApiProperty({ example: '0x...', required: false })
  @IsString()
  txHash?: string;
}

