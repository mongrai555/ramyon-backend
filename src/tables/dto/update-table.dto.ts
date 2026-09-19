import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateTableDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsEnum(['active', 'occupied', 'inactive'])
  @IsOptional()
  status?: string;
}
