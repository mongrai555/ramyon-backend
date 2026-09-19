import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Table, TableSchema } from './schemas/table.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [TablesService],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
