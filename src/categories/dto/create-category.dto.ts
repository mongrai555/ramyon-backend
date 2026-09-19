import { IsString, IsNotEmpty, IsOptional, IsNumber, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  restaurantId: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
