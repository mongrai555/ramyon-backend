import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        role: string;
        restaurantId: import("mongoose").Types.ObjectId;
        displayName: string | undefined;
        phoneNumber: string | undefined;
        email: string | undefined;
        profileImageUrl: string | undefined;
    }[]>;
    create(req: any, body: any): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        role: string;
    }>;
    uploadAvatar(file: Express.Multer.File): {
        imageUrl: string;
    };
    update(req: any, userId: string, body: any): Promise<{
        id: import("mongoose").Types.ObjectId | undefined;
        username: string | undefined;
        role: string | undefined;
    }>;
    delete(req: any, userId: string): Promise<{
        success: boolean;
    }>;
}
