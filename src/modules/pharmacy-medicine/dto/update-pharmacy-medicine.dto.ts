import { PartialType } from '@nestjs/mapped-types';
import { CreatePharmacyMedicineDto } from './create-pharmacy-medicine.dto';
import { IsOptional, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePharmacyMedicineDto extends PartialType(CreatePharmacyMedicineDto) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  pharmacyId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  medicineId?: number;
}