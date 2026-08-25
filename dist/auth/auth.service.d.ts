import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(username: string, passwordPlain: string, role: string, restaurantId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        role: string;
        restaurantId: import("mongoose").Types.ObjectId;
    }>;
    login(username: string, passwordPlain: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            role: string;
            restaurantId: import("mongoose").Types.ObjectId;
            displayName: string | undefined;
            profileImageUrl: string | undefined;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
}
