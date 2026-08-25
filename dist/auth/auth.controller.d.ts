import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        username: string;
        role: string;
        restaurantId: import("mongoose").Types.ObjectId;
    }>;
    login(loginDto: LoginDto): Promise<{
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
    logout(req: any): Promise<{
        success: boolean;
    }>;
    getProfile(req: any): any;
}
