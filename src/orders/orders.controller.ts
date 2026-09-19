import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  findAllByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.ordersService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('active/table/:tableId')
  findActiveByTable(@Param('tableId') tableId: string) {
    return this.ordersService.findActiveByTable(tableId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  updatePayment(@Param('id') id: string, @Body() updateOrderPaymentDto: UpdateOrderPaymentDto) {
    return this.ordersService.updatePayment(id, updateOrderPaymentDto);
  }
}
