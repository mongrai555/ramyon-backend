import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    create(createMenuItemDto: CreateMenuItemDto): Promise<import("./schemas/menu-item.schema").MenuItemDocument>;
    uploadImage(file: Express.Multer.File): {
        imageUrl: string;
    };
    findAllByRestaurant(restaurantId: string): Promise<import("./schemas/menu-item.schema").MenuItemDocument[]>;
    findAllByCategory(categoryId: string): Promise<import("./schemas/menu-item.schema").MenuItemDocument[]>;
    findOne(id: string): Promise<import("./schemas/menu-item.schema").MenuItemDocument>;
    update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<import("./schemas/menu-item.schema").MenuItemDocument>;
    remove(id: string): Promise<any>;
}
