import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string, passwordHash: string, role: string, restaurantId: string): Promise<UserDocument> {
    const newUser = new this.userModel({
      username,
      passwordHash,
      role,
      restaurantId: new Types.ObjectId(restaurantId),
    });
    return newUser.save();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findAllByRestaurant(restaurantId: string): Promise<UserDocument[]> {
    return this.userModel.find({ restaurantId: new Types.ObjectId(restaurantId) }).exec();
  }

  async createFull(
    username: string,
    passwordHash: string,
    role: string,
    restaurantId: string,
    displayName?: string,
    phoneNumber?: string,
    email?: string,
    profileImageUrl?: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      username,
      passwordHash,
      role,
      restaurantId: new Types.ObjectId(restaurantId),
      displayName,
      phoneNumber,
      email,
      profileImageUrl,
    });
    return newUser.save();
  }

  async updateFull(userId: string, updateData: any): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).exec();
  }

  async delete(userId: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    return !!result;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    let refreshTokenHash: string | null = null;
    if (refreshToken) {
      refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    }
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash }).exec();
  }

  async compareRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.refreshTokenHash) {
      return false;
    }
    return bcrypt.compare(refreshToken, user.refreshTokenHash);
  }
}
