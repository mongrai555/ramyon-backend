import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsMongoId()
  restaurantId: string;
}
