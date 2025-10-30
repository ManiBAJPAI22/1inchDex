import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum Side {
  BUY = 'buy',
  SELL = 'sell',
}

export class CreateOrderDto {
  @ApiProperty({ enum: Side, enumName: 'Side' })
  @IsNotEmpty()
  side: Side;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  metadata: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'BTC-USDT', required: false })
  @IsString()
  pairId?: string;

  @ApiProperty({ example: '0x...', required: false })
  @IsString()
  userAddress?: string;
}
