import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Request() req: any) {
    const restaurantId = req.user.restaurantId;
    const users = await this.usersService.findAllByRestaurant(restaurantId);
    // Remove sensitive password hashes before returning
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

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    const restaurantId = req.user.restaurantId;
    const { username, password, role, displayName, phoneNumber, email, profileImageUrl } = body;

    if (!username || !password || !role) {
      throw new BadRequestException('Username, password, and role are required');
    }

    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.createFull(
      username,
      passwordHash,
      role,
      restaurantId,
      displayName,
      phoneNumber,
      email,
      profileImageUrl,
    );

    return {
      id: user._id,
      username: user.username,
      role: user.role,
    };
  }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
          return callback(new BadRequestException('Only JPG, JPEG, and PNG images are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is not an image');
    }
    return { imageUrl: `/uploads/${file.filename}` };
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') userId: string, @Body() body: any) {
    const restaurantId = req.user.restaurantId;
    const userToEdit = await this.usersService.findById(userId);

    if (!userToEdit) {
      throw new BadRequestException('User not found');
    }

    // Security check: Ensure the user belongs to the same restaurant
    if (userToEdit.restaurantId.toString() !== restaurantId) {
      throw new ForbiddenException('You can only manage employees of your own restaurant');
    }

    const updateData: any = {};
    if (body.role) updateData.role = body.role;
    if (body.displayName !== undefined) updateData.displayName = body.displayName;
    if (body.phoneNumber !== undefined) updateData.phoneNumber = body.phoneNumber;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.profileImageUrl !== undefined) updateData.profileImageUrl = body.profileImageUrl;

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

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') userId: string) {
    const currentUserId = req.user.id;
    const restaurantId = req.user.restaurantId;

    if (currentUserId === userId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    const userToDelete = await this.usersService.findById(userId);
    if (!userToDelete) {
      throw new BadRequestException('User not found');
    }

    if (userToDelete.restaurantId.toString() !== restaurantId) {
      throw new ForbiddenException('You can only delete employees of your own restaurant');
    }

    const success = await this.usersService.delete(userId);
    return { success };
  }
}
