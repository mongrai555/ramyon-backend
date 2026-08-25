import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(username: string, passwordHash: string, role: string, restaurantId: string): Promise<UserDocument>;
    findByUsername(username: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    findAllByRestaurant(restaurantId: string): Promise<UserDocument[]>;
    createFull(username: string, passwordHash: string, role: string, restaurantId: string, displayName?: string, phoneNumber?: string, email?: string, profileImageUrl?: string): Promise<UserDocument>;
    updateFull(userId: string, updateData: any): Promise<UserDocument | null>;
    delete(userId: string): Promise<boolean>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    compareRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
}
