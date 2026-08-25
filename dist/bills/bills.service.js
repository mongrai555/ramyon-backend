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
exports.BillsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bill_schema_1 = require("./schemas/bill.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const tables_service_1 = require("../tables/tables.service");
let BillsService = class BillsService {
    billModel;
    orderModel;
    tablesService;
    constructor(billModel, orderModel, tablesService) {
        this.billModel = billModel;
        this.orderModel = orderModel;
        this.tablesService = tablesService;
    }
    async checkout(createBillDto, cashierId, cashierName, cashierUsername) {
        const tableId = createBillDto.tableId;
        const table = await this.tablesService.findOne(tableId);
        const activeOrders = await this.orderModel.find({
            tableId: new mongoose_2.Types.ObjectId(tableId),
            paymentStatus: 'pending',
            status: { $ne: 'cancelled' },
        }).exec();
        if (activeOrders.length === 0) {
            throw new common_1.BadRequestException('No active unpaid orders found for this table.');
        }
        const restaurantId = activeOrders[0].restaurantId;
        const orderIds = activeOrders.map(order => order._id);
        const consolidatedItemsMap = new Map();
        for (const order of activeOrders) {
            for (const item of order.items) {
                const key = item.menuItemId.toString();
                if (consolidatedItemsMap.has(key)) {
                    const existing = consolidatedItemsMap.get(key);
                    existing.quantity += item.quantity;
                }
                else {
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
        const totalPrice = consolidatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newBill = new this.billModel({
            restaurantId,
            tableId: new mongoose_2.Types.ObjectId(tableId),
            orderIds,
            items: consolidatedItems,
            totalPrice,
            paymentMethod: createBillDto.paymentMethod || 'cash',
            paymentStatus: 'paid',
            cashierId: cashierId ? new mongoose_2.Types.ObjectId(cashierId) : undefined,
            cashierName: cashierName || undefined,
            cashierUsername: cashierUsername || undefined,
        });
        const savedBill = await newBill.save();
        await this.orderModel.updateMany({ _id: { $in: orderIds } }, { $set: { paymentStatus: 'paid', status: 'completed' } }).exec();
        await this.tablesService.update(tableId, { status: 'active' });
        return savedBill;
    }
    async findAllByRestaurant(restaurantId) {
        return this.billModel
            .find({ restaurantId: new mongoose_2.Types.ObjectId(restaurantId) })
            .populate('tableId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const bill = await this.billModel.findById(id).populate('tableId').exec();
        if (!bill) {
            throw new common_1.NotFoundException(`Bill with ID ${id} not found`);
        }
        return bill;
    }
    async remove(id) {
        const result = await this.billModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Bill with ID ${id} not found`);
        }
        return { message: 'Bill successfully deleted' };
    }
    async removeAll(restaurantId) {
        await this.billModel.deleteMany({ restaurantId: new mongoose_2.Types.ObjectId(restaurantId) }).exec();
        return { message: 'All bills successfully deleted' };
    }
};
exports.BillsService = BillsService;
exports.BillsService = BillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        tables_service_1.TablesService])
], BillsService);
//# sourceMappingURL=bills.service.js.map