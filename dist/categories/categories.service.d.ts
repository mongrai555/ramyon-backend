import { Model } from 'mongoose';
import { CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument>;
    findAllByRestaurant(restaurantId: string): Promise<CategoryDocument[]>;
    findOne(id: string): Promise<CategoryDocument>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument>;
    remove(id: string): Promise<any>;
}
