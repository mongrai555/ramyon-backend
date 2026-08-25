import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(createRestaurantDto: CreateRestaurantDto): Promise<import("./schemas/restaurant.schema").RestaurantDocument>;
    findAll(): Promise<import("./schemas/restaurant.schema").RestaurantDocument[]>;
    findOne(id: string): Promise<import("./schemas/restaurant.schema").RestaurantDocument>;
    update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<import("./schemas/restaurant.schema").RestaurantDocument>;
}
