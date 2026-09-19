import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private menuItemsService: MenuItemsService,
    private tablesService: TablesService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    // 1. Verify Table exists and is active
    const table = await this.tablesService.findOne(createOrderDto.tableId);
    if (table.status === 'inactive') {
      throw new BadRequestException('This table is currently inactive.');
    }

    // 2. Fetch prices and calculate total
    let totalPrice = 0;
    const itemsList = [];

    for (const item of createOrderDto.items) {
      const menuItem = await this.menuItemsService.findOne(item.menuItemId);
      if (!menuItem.isAvailable) {
        throw new BadRequestException(`Item ${menuItem.name} is currently sold out.`);
      }

      const itemPrice = menuItem.price;
      const subtotal = itemPrice * item.quantity;
      totalPrice += subtotal;

      itemsList.push({
        menuItemId: new Types.ObjectId(item.menuItemId),
        name: menuItem.name,
        quantity: item.quantity,
        price: itemPrice,
        specialInstructions: item.specialInstructions || '',
      });
    }

    // 3. Create the order
    const createdOrder = new this.orderModel({
      restaurantId: new Types.ObjectId(createOrderDto.restaurantId),
      tableId: new Types.ObjectId(createOrderDto.tableId),
      items: itemsList,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: createOrderDto.paymentMethod || 'cash',
    });

    // Automatically update table status to 'occupied' when order is placed
    await this.tablesService.update(createOrderDto.tableId, { status: 'occupied' });

    return createdOrder.save();
  }

  async findAllByRestaurant(restaurantId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ restaurantId: new Types.ObjectId(restaurantId) })
      .populate('tableId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).populate('tableId').exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findActiveByTable(tableId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({
        tableId: new Types.ObjectId(tableId),
        paymentStatus: 'pending',
        status: { $ne: 'cancelled' },
      })
      .populate('tableId')
      .sort({ createdAt: 1 })
      .exec();
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = updateOrderStatusDto.status;

    // If order is completed or cancelled, make the table 'active' (vacant) again
    if (updateOrderStatusDto.status === 'completed' || updateOrderStatusDto.status === 'cancelled') {
      await this.tablesService.update(order.tableId.toString(), { status: 'active' });
    }

    return order.save();
  }

  async updatePayment(id: string, updateOrderPaymentDto: UpdateOrderPaymentDto): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.paymentStatus = updateOrderPaymentDto.paymentStatus;
    return order.save();
  }
}
