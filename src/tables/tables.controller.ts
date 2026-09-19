import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Post('move')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  moveTable(@Body() body: { fromTableId: string; toTableId: string }) {
    return this.tablesService.moveTable(body.fromTableId, body.toTableId);
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  findAllByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.tablesService.findAllByRestaurant(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }

  @Get(':id/qrcode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  async getQrCodeImage(@Param('id') id: string) {
    const qrCodeImage = await this.tablesService.getQrCodeImage(id);
    return { qrCodeImage };
  }
}
