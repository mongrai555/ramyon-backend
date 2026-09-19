import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  checkout(@Request() req: any, @Body() createBillDto: CreateBillDto) {
    const cashierId = req.user.id;
    const cashierName = req.user.displayName || req.user.username;
    const cashierUsername = req.user.username;
    return this.billsService.checkout(createBillDto, cashierId, cashierName, cashierUsername);
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  findAllByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.billsService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.billsService.remove(id);
  }

  @Delete('restaurant/:restaurantId/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeAll(@Param('restaurantId') restaurantId: string) {
    return this.billsService.removeAll(restaurantId);
  }
}

