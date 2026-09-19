import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { Bill, BillSchema } from './schemas/bill.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    TablesModule,
  ],
  providers: [BillsService],
  controllers: [BillsController],
  exports: [BillsService],
})
export class BillsModule {}
