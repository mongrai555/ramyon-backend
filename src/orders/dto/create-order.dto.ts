import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Min, IsEnum, IsMongoId, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsMongoId()
  @IsNotEmpty()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Special instructions cannot exceed 200 characters' })
  specialInstructions?: string;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  restaurantId: string;

  @IsMongoId()
  @IsNotEmpty()
  tableId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(['cash', 'promptpay', 'credit_card'])
  @IsOptional()
  paymentMethod?: string;
}
