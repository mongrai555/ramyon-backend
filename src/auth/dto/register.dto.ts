import { IsString, IsNotEmpty, MinLength, IsEnum, IsMongoId } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(['admin', 'staff'])
  role: string;

  @IsMongoId()
  restaurantId: string;
}
