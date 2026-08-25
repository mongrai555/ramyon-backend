"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const table_schema_1 = require("./schemas/table.schema");
const config_1 = require("@nestjs/config");
const QRCode = __importStar(require("qrcode"));
const order_schema_1 = require("../orders/schemas/order.schema");
let TablesService = class TablesService {
    tableModel;
    orderModel;
    configService;
    constructor(tableModel, orderModel, configService) {
        this.tableModel = tableModel;
        this.orderModel = orderModel;
        this.configService = configService;
    }
    async create(createTableDto) {
        const restaurantId = createTableDto.restaurantId;
        const tableId = new mongoose_2.Types.ObjectId();
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
        const qrCodeUrl = `${frontendUrl}/menu?restaurantId=${restaurantId}&tableId=${tableId.toString()}`;
        const createdTable = new this.tableModel({
            _id: tableId,
            number: createTableDto.number,
            restaurantId: new mongoose_2.Types.ObjectId(restaurantId),
            qrCodeUrl,
            status: 'active',
        });
        return createdTable.save();
    }
    async findOne(id) {
        const table = await this.tableModel.findById(id).exec();
        if (!table) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found`);
        }
        return table;
    }
    async findAllByRestaurant(restaurantId) {
        return this.tableModel.find({ restaurantId: new mongoose_2.Types.ObjectId(restaurantId) }).exec();
    }
    async update(id, updateTableDto) {
        const updatedTable = await this.tableModel
            .findByIdAndUpdate(id, updateTableDto, { new: true })
            .exec();
        if (!updatedTable) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found`);
        }
        return updatedTable;
    }
    async remove(id) {
        const result = await this.tableModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found`);
        }
        return { message: 'Table successfully deleted' };
    }
    async getQrCodeImage(id) {
        const table = await this.findOne(id);
        try {
            const qrCodeImage = await QRCode.toDataURL(table.qrCodeUrl);
            return qrCodeImage;
        }
        catch (err) {
            throw new common_1.BadRequestException('Failed to generate QR Code image');
        }
    }
    async moveTable(fromTableId, toTableId) {
        const fromTable = await this.findOne(fromTableId);
        const toTable = await this.findOne(toTableId);
        if (fromTable.status !== 'occupied') {
            throw new common_1.BadRequestException('Source table is not occupied');
        }
        await this.orderModel.updateMany({
            tableId: new mongoose_2.Types.ObjectId(fromTableId),
            paymentStatus: 'pending',
            status: { $ne: 'cancelled' },
        }, {
            $set: { tableId: new mongoose_2.Types.ObjectId(toTableId) }
        }).exec();
        fromTable.status = 'active';
        await fromTable.save();
        toTable.status = 'occupied';
        await toTable.save();
        return {
            message: `Successfully moved orders from table ${fromTable.number} to table ${toTable.number}`,
            fromTable,
            toTable
        };
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(table_schema_1.Table.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], TablesService);
//# sourceMappingURL=tables.service.js.map