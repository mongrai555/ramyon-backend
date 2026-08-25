import { Model } from 'mongoose';
import { RestaurantDocument } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class RestaurantsService {
    private restaurantModel;
    constructor(restaurantModel: Model<RestaurantDocument>);
    create(createRestaurantDto: CreateRestaurantDto): Promise<RestaurantDocument>;
    findOne(id: string): Promise<RestaurantDocument>;
    findAll(): Promise<RestaurantDocument[]>;
    update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<RestaurantDocument>;
}
