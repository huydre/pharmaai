import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  usage?: string;

  @IsString()
  @IsOptional()
  sideEffects?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  relatedDisease?: string;
}