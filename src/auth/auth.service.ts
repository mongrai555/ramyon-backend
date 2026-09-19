import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(username: string, passwordPlain: string, role: string, restaurantId: string) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
    const hashed = await bcrypt.hash(passwordPlain, 10);
    const user = await this.usersService.create(username, hashed, role, restaurantId);
    return {
      id: user._id,
      username: user.username,
      role: user.role,
      restaurantId: user.restaurantId,
    };
  }

  async login(username: string, passwordPlain: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
      restaurantId: user.restaurantId.toString(),
    };

    const accessExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    const access_token = this.jwtService.sign(payload, { expiresIn: accessExpiry as any });
    const refresh_token = this.jwtService.sign({ sub: user._id.toString() }, { expiresIn: refreshExpiry as any });

    // Store hashed refresh token in database
    await this.usersService.updateRefreshToken(user._id.toString(), refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        restaurantId: user.restaurantId,
        displayName: user.displayName,
        profileImageUrl: user.profileImageUrl,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const userId = decoded.sub;

      const isValid = await this.usersService.compareRefreshToken(userId, refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const payload = {
        sub: user._id.toString(),
        username: user.username,
        role: user.role,
        restaurantId: user.restaurantId.toString(),
      };

      const accessExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
      const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

      const access_token = this.jwtService.sign(payload, { expiresIn: accessExpiry as any });
      const refresh_token = this.jwtService.sign({ sub: user._id.toString() }, { expiresIn: refreshExpiry as any });

      // Rotate refresh token
      await this.usersService.updateRefreshToken(user._id.toString(), refresh_token);

      return {
        access_token,
        refresh_token,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { success: true };
  }
}
