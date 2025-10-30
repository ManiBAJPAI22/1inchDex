import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    console.log({ createOrderDto }, 'createOrder');
    return await this.orderService.createOrder(createOrderDto);
  }

  @Get('/order-book-history')
  @ApiOperation({ summary: 'Get order book history' })
  async getOrderHistory() {
    return await this.orderService.getOrderHistory();
  }

  @Get('/order-book/:pairId')
  @ApiOperation({ summary: 'Get current order book for a pair' })
  async getOrderBook(@Param('pairId') pairId: string) {
    return await this.orderService.getOrderBook(pairId);
  }

  @Get('/open-orders')
  @ApiOperation({ summary: 'Get all open orders' })
  @ApiQuery({ name: 'userAddress', required: false })
  @ApiQuery({ name: 'pairId', required: false })
  async getOpenOrders(
    @Query('userAddress') userAddress?: string,
    @Query('pairId') pairId?: string,
  ) {
    return await this.orderService.getOpenOrders(userAddress, pairId);
  }

  @Get('/user/:address')
  @ApiOperation({ summary: 'Get user order history' })
  async getUserOrders(@Param('address') address: string) {
    return await this.orderService.getUserOrders(address);
  }
}
