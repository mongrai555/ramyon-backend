"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const bcrypt = __importStar(require("bcrypt"));
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(req) {
        const restaurantId = req.user.restaurantId;
        const users = await this.usersService.findAllByRestaurant(restaurantId);
        return users.map((u) => ({
            id: u._id,
            username: u.username,
            role: u.role,
            restaurantId: u.restaurantId,
            displayName: u.displayName,
            phoneNumber: u.phoneNumber,
            email: u.email,
            profileImageUrl: u.profileImageUrl,
        }));
    }
    async create(req, body) {
        const restaurantId = req.user.restaurantId;
        const { username, password, role, displayName, phoneNumber, email, profileImageUrl } = body;
        if (!username || !password || !role) {
            throw new common_1.BadRequestException('Username, password, and role are required');
        }
        const existing = await this.usersService.findByUsername(username);
        if (existing) {
            throw new common_1.BadRequestException('Username already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.usersService.createFull(username, passwordHash, role, restaurantId, displayName, phoneNumber, email, profileImageUrl);
        return {
            id: user._id,
            username: user.username,
            role: user.role,
        };
    }
    uploadAvatar(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded or file is not an image');
        }
        return { imageUrl: `/uploads/${file.filename}` };
    }
    async update(req, userId, body) {
        const restaurantId = req.user.restaurantId;
        const userToEdit = await this.usersService.findById(userId);
        if (!userToEdit) {
            throw new common_1.BadRequestException('User not found');
        }
        if (userToEdit.restaurantId.toString() !== restaurantId) {
            throw new common_1.ForbiddenException('You can only manage employees of your own restaurant');
        }
        const updateData = {};
        if (body.role)
            updateData.role = body.role;
        if (body.displayName !== undefined)
            updateData.displayName = body.displayName;
        if (body.phoneNumber !== undefined)
            updateData.phoneNumber = body.phoneNumber;
        if (body.email !== undefined)
            updateData.email = body.email;
        if (body.profileImageUrl !== undefined)
            updateData.profileImageUrl = body.profileImageUrl;
        if (body.password) {
            updateData.passwordHash = await bcrypt.hash(body.password, 10);
        }
        const updatedUser = await this.usersService.updateFull(userId, updateData);
        return {
            id: updatedUser?._id,
            username: updatedUser?.username,
            role: updatedUser?.role,
        };
    }
    async delete(req, userId) {
        const currentUserId = req.user.id;
        const restaurantId = req.user.restaurantId;
        if (currentUserId === userId) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        const userToDelete = await this.usersService.findById(userId);
        if (!userToDelete) {
            throw new common_1.BadRequestException('User not found');
        }
        if (userToDelete.restaurantId.toString() !== restaurantId) {
            throw new common_1.ForbiddenException('You can only delete employees of your own restaurant');
        }
        const success = await this.usersService.delete(userId);
        return { success };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload-avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `avatar-${uniqueSuffix}${ext}`);
            },
        }),
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                return callback(new common_1.BadRequestException('Only JPG, JPEG, and PNG images are allowed!'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map