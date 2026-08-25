import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { TablesService } from '../tables/tables.service';
export declare class OrdersService {
    private orderModel;
    private menuItemsService;
    private tablesService;
    constructor(orderModel: Model<OrderDocument>, menuItemsService: MenuItemsService, tablesService: TablesService);
    create(createOrderDto: CreateOrderDto): Promise<OrderDocument>;
    findAllByRestaurant(restaurantId: string): Promise<OrderDocument[]>;
    findOne(id: string): Promise<OrderDocument>;
    findActiveByTable(tableId: string): Promise<OrderDocument[]>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderDocument>;
    updatePayment(id: string, updateOrderPaymentDto: UpdateOrderPaymentDto): Promise<OrderDocument>;
}
