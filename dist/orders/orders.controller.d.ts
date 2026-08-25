import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderPaymentDto } from './dto/update-order-payment.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    findAllByRestaurant(restaurantId: string): Promise<import("./schemas/order.schema").OrderDocument[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").OrderDocument>;
    findActiveByTable(tableId: string): Promise<import("./schemas/order.schema").OrderDocument[]>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./schemas/order.schema").OrderDocument>;
    updatePayment(id: string, updateOrderPaymentDto: UpdateOrderPaymentDto): Promise<import("./schemas/order.schema").OrderDocument>;
}
