import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePharmacyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude: number;

  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  googlePlaceId?: string;
}