import { Model } from 'mongoose';
import { MenuItemDocument } from './schemas/menu-item.schema';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class MenuItemsService {
    private menuItemModel;
    constructor(menuItemModel: Model<MenuItemDocument>);
    create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItemDocument>;
    findAllByRestaurant(restaurantId: string): Promise<MenuItemDocument[]>;
    findAllByCategory(categoryId: string): Promise<MenuItemDocument[]>;
    findOne(id: string): Promise<MenuItemDocument>;
    update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItemDocument>;
    remove(id: string): Promise<any>;
}
