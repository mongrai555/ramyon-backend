import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<RestaurantDocument> {
    const createdRestaurant = new this.restaurantModel(createRestaurantDto);
    return createdRestaurant.save();
  }

  async findOne(id: string): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async findAll(): Promise<RestaurantDocument[]> {
    return this.restaurantModel.find().exec();
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<RestaurantDocument> {
    const updatedRestaurant = await this.restaurantModel
      .findByIdAndUpdate(id, updateRestaurantDto, { new: true })
      .exec();
    if (!updatedRestaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return updatedRestaurant;
  }
}
