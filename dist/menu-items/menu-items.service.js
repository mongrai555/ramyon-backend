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
exports.MenuItemsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const menu_item_schema_1 = require("./schemas/menu-item.schema");
let MenuItemsService = class MenuItemsService {
    menuItemModel;
    constructor(menuItemModel) {
        this.menuItemModel = menuItemModel;
    }
    async create(createMenuItemDto) {
        const categoryId = createMenuItemDto.category || createMenuItemDto.categoryId;
        const createdItem = new this.menuItemModel({
            name: createMenuItemDto.name,
            description: createMenuItemDto.description,
            price: createMenuItemDto.price,
            imageUrl: createMenuItemDto.imageUrl,
            isAvailable: createMenuItemDto.isAvailable,
            category: new mongoose_2.Types.ObjectId(categoryId),
            restaurantId: new mongoose_2.Types.ObjectId(createMenuItemDto.restaurantId),
        });
        return createdItem.save();
    }
    async findAllByRestaurant(restaurantId) {
        return this.menuItemModel
            .find({ restaurantId: new mongoose_2.Types.ObjectId(restaurantId) })
            .populate('category')
            .exec();
    }
    async findAllByCategory(categoryId) {
        return this.menuItemModel
            .find({ category: new mongoose_2.Types.ObjectId(categoryId) })
            .populate('category')
            .exec();
    }
    async findOne(id) {
        const item = await this.menuItemModel.findById(id).populate('category').exec();
        if (!item) {
            throw new common_1.NotFoundException(`Menu Item with ID ${id} not found`);
        }
        return item;
    }
    async update(id, updateMenuItemDto) {
        const updateData = { ...updateMenuItemDto };
        const categoryId = updateMenuItemDto.category || updateMenuItemDto.categoryId;
        if (categoryId) {
            updateData.category = new mongoose_2.Types.ObjectId(categoryId);
            delete updateData.categoryId;
        }
        const updatedItem = await this.menuItemModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('category')
            .exec();
        if (!updatedItem) {
            throw new common_1.NotFoundException(`Menu Item with ID ${id} not found`);
        }
        return updatedItem;
    }
    async remove(id) {
        const result = await this.menuItemModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Menu Item with ID ${id} not found`);
        }
        return { message: 'Menu Item successfully deleted' };
    }
};
exports.MenuItemsService = MenuItemsService;
exports.MenuItemsService = MenuItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(menu_item_schema_1.MenuItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MenuItemsService);
//# sourceMappingURL=menu-items.service.js.map