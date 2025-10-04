import { IsNumber, IsPositive, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePharmacyMedicineDto {
  @ApiProperty({ 
    description: 'Pharmacy ID', 
    example: 1
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  pharmacyId: number;

  @ApiProperty({ 
    description: 'Medicine ID', 
    example: 1
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  medicineId: number;

  @ApiProperty({ 
    description: 'Số lượng trong kho',
    example: 50,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({ 
    description: 'Price override for this pharmacy (if different from base price)',
    example: 12.75,
    type: 'number',
    format: 'decimal'
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  priceOverride?: number;
}