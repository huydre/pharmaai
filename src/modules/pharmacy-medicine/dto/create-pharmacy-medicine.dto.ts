import { IsNumber, IsPositive, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePharmacyMedicineDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  pharmacyId: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  medicineId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  priceOverride?: number;
}