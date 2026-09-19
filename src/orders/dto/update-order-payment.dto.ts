import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderPaymentDto {
  @IsEnum(['pending', 'paid'])
  @IsNotEmpty()
  paymentStatus: string;
}
