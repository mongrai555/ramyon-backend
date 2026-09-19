import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'preparing', 'served', 'completed', 'cancelled'])
  @IsNotEmpty()
  status: string;
}
