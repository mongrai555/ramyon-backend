import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bill, BillDocument } from './schemas/bill.schema';
import { CreateBillDto } from './dto/create-bill.dto';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private tablesService: TablesService,
  ) {}

  async checkout(createBillDto: CreateBillDto, cashierId?: string, cashierName?: string, cashierUsername?: string): Promise<BillDocument> {
    const tableId = createBillDto.tableId;

    // 1. Verify Table exists
    const table = await this.tablesService.findOne(tableId);

    // 2. Find all unpaid, non-cancelled orders for this table
    const activeOrders = await this.orderModel.find({
      tableId: new Types.ObjectId(tableId),
      paymentStatus: 'pending',
      status: { $ne: 'cancelled' },
    }).exec();

    if (activeOrders.length === 0) {
      throw new BadRequestException('No active unpaid orders found for this table.');
    }

    // 3. Consolidate items
    const restaurantId = activeOrders[0].restaurantId;
    const orderIds = activeOrders.map(order => order._id as Types.ObjectId);
    const consolidatedItemsMap = new Map<string, { menuItemId: Types.ObjectId; name: string; quantity: number; price: number }>();

    for (const order of activeOrders) {
      for (const item of order.items) {
        const key = item.menuItemId.toString();
        if (consolidatedItemsMap.has(key)) {
          const existing = consolidatedItemsMap.get(key)!;
          existing.quantity += item.quantity;
        } else {
          consolidatedItemsMap.set(key, {
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }
    }

    const consolidatedItems = Array.from(consolidatedItemsMap.values());

    // 4. Calculate total price
    const totalPrice = consolidatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 5. Create new Bill
    const newBill = new this.billModel({
      restaurantId,
      tableId: new Types.ObjectId(tableId),
      orderIds,
      items: consolidatedItems,
      totalPrice,
      paymentMethod: createBillDto.paymentMethod || 'cash',
      paymentStatus: 'paid', // Mark the bill as paid upon checkout
      cashierId: cashierId ? new Types.ObjectId(cashierId) : undefined,
      cashierName: cashierName || undefined,
      cashierUsername: cashierUsername || undefined,
    });

    const savedBill = await newBill.save();

    // 6. Update all consolidated orders' paymentStatus to 'paid' and set status to 'completed'
    await this.orderModel.updateMany(
      { _id: { $in: orderIds } },
      { $set: { paymentStatus: 'paid', status: 'completed' } },
    ).exec();

    // 7. End the seating: table goes vacant and its session rotates, which is
    // what flips the customers' phones to the thank-you screen.
    await this.tablesService.closeSession(tableId);

    return savedBill;
  }

  async findAllByRestaurant(restaurantId: string): Promise<BillDocument[]> {
    return this.billModel
      .find({ restaurantId: new Types.ObjectId(restaurantId) })
      .populate('tableId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<BillDocument> {
    const bill = await this.billModel.findById(id).populate('tableId').exec();
    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
    return bill;
  }

  async remove(id: string): Promise<any> {
    const result = await this.billModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
    return { message: 'Bill successfully deleted' };
  }

  async removeAll(restaurantId: string): Promise<any> {
    await this.billModel.deleteMany({ restaurantId: new Types.ObjectId(restaurantId) }).exec();
    return { message: 'All bills successfully deleted' };
  }
}

