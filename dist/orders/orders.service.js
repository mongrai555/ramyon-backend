"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const menu_items_service_1 = require("../menu-items/menu-items.service");
const tables_service_1 = require("../tables/tables.service");
let OrdersService = class OrdersService {
    orderModel;
    menuItemsService;
    tablesService;
    constructor(orderModel, menuItemsService, tablesService) {
        this.orderModel = orderModel;
        this.menuItemsService = menuItemsService;
        this.tablesService = tablesService;
    }
    async create(createOrderDto) {
        const table = await this.tablesService.findOne(createOrderDto.tableId);
        if (table.status === 'inactive') {
            throw new common_1.BadRequestException('This table is currently inactive.');
        }
        let totalPrice = 0;
        const itemsList = [];
        for (const item of createOrderDto.items) {
            const menuItem = await this.menuItemsService.findOne(item.menuItemId);
            if (!menuItem.isAvailable) {
                throw new common_1.BadRequestException(`Item ${menuItem.name} is currently sold out.`);
            }
            const itemPrice = menuItem.price;
            const subtotal = itemPrice * item.quantity;
            totalPrice += subtotal;
            itemsList.push({
                menuItemId: new mongoose_2.Types.ObjectId(item.menuItemId),
                name: menuItem.name,
                quantity: item.quantity,
                price: itemPrice,
                specialInstructions: item.specialInstructions || '',
            });
        }
        const createdOrder = new this.orderModel({
            restaurantId: new mongoose_2.Types.ObjectId(createOrderDto.restaurantId),
            tableId: new mongoose_2.Types.ObjectId(createOrderDto.tableId),
            items: itemsList,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: createOrderDto.paymentMethod || 'cash',
        });
        await this.tablesService.update(createOrderDto.tableId, { status: 'occupied' });
        return createdOrder.save();
    }
    async findAllByRestaurant(restaurantId) {
        return this.orderModel
            .find({ restaurantId: new mongoose_2.Types.ObjectId(restaurantId) })
            .populate('tableId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id).populate('tableId').exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async findActiveByTable(tableId) {
        return this.orderModel
            .find({
            tableId: new mongoose_2.Types.ObjectId(tableId),
            paymentStatus: 'pending',
            status: { $ne: 'cancelled' },
        })
            .populate('tableId')
            .sort({ createdAt: 1 })
            .exec();
    }
    async updateStatus(id, updateOrderStatusDto) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        order.status = updateOrderStatusDto.status;
        if (updateOrderStatusDto.status === 'completed' || updateOrderStatusDto.status === 'cancelled') {
            await this.tablesService.update(order.tableId.toString(), { status: 'active' });
        }
        return order.save();
    }
    async updatePayment(id, updateOrderPaymentDto) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        order.paymentStatus = updateOrderPaymentDto.paymentStatus;
        return order.save();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        menu_items_service_1.MenuItemsService,
        tables_service_1.TablesService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map