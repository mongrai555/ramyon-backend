import { IsString, IsOptional, IsNumber, Min, IsBoolean, IsMongoId } from 'class-validator';

export class UpdateMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsMongoId()
  @IsOptional()
  category?: string;
}
