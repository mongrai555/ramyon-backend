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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillSchema = exports.Bill = exports.BillItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BillItem = class BillItem {
    menuItemId;
    name;
    quantity;
    price;
};
exports.BillItem = BillItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'MenuItem', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BillItem.prototype, "menuItemId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BillItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], BillItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], BillItem.prototype, "price", void 0);
exports.BillItem = BillItem = __decorate([
    (0, mongoose_1.Schema)()
], BillItem);
const BillItemSchema = mongoose_1.SchemaFactory.createForClass(BillItem);
let Bill = class Bill {
    restaurantId;
    tableId;
    orderIds;
    items;
    totalPrice;
    paymentMethod;
    paymentStatus;
    cashierId;
    cashierName;
    cashierUsername;
};
exports.Bill = Bill;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Restaurant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Bill.prototype, "restaurantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Table', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Bill.prototype, "tableId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Order', required: true }),
    __metadata("design:type", Array)
], Bill.prototype, "orderIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BillItemSchema], required: true }),
    __metadata("design:type", Array)
], Bill.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['cash', 'promptpay', 'credit_card'], default: 'cash' }),
    __metadata("design:type", String)
], Bill.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['pending', 'paid'], default: 'paid' }),
    __metadata("design:type", String)
], Bill.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Bill.prototype, "cashierId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Bill.prototype, "cashierName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Bill.prototype, "cashierUsername", void 0);
exports.Bill = Bill = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Bill);
exports.BillSchema = mongoose_1.SchemaFactory.createForClass(Bill);
//# sourceMappingURL=bill.schema.js.map