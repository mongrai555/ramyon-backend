import { IsMongoId, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateBillDto {
  @IsMongoId()
  @IsNotEmpty()
  tableId: string;

  @IsEnum(['cash', 'promptpay', 'credit_card'])
  @IsOptional()
  paymentMethod?: string;
}
