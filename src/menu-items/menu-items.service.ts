import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItemDocument> {
    const categoryId = createMenuItemDto.category || createMenuItemDto.categoryId;
    
    const createdItem = new this.menuItemModel({
      name: createMenuItemDto.name,
      description: createMenuItemDto.description,
      price: createMenuItemDto.price,
      imageUrl: createMenuItemDto.imageUrl,
      isAvailable: createMenuItemDto.isAvailable,
      category: new Types.ObjectId(categoryId),
      restaurantId: new Types.ObjectId(createMenuItemDto.restaurantId),
    });
    return createdItem.save();
  }

  async findAllByRestaurant(restaurantId: string): Promise<MenuItemDocument[]> {
    return this.menuItemModel
      .find({ restaurantId: new Types.ObjectId(restaurantId) })
      .populate('category')
      .exec();
  }

  async findAllByCategory(categoryId: string): Promise<MenuItemDocument[]> {
    return this.menuItemModel
      .find({ category: new Types.ObjectId(categoryId) })
      .populate('category')
      .exec();
  }

  async findOne(id: string): Promise<MenuItemDocument> {
    const item = await this.menuItemModel.findById(id).populate('category').exec();
    if (!item) {
      throw new NotFoundException(`Menu Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItemDocument> {
    const updateData: any = { ...updateMenuItemDto };
    
    const categoryId = updateMenuItemDto.category || updateMenuItemDto.categoryId;
    if (categoryId) {
      updateData.category = new Types.ObjectId(categoryId);
      delete updateData.categoryId;
    }

    const updatedItem = await this.menuItemModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('category')
      .exec();
    if (!updatedItem) {
      throw new NotFoundException(`Menu Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<any> {
    const result = await this.menuItemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Menu Item with ID ${id} not found`);
    }
    return { message: 'Menu Item successfully deleted' };
  }
}
