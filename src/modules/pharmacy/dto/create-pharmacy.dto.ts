import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePharmacyDto {
  @ApiProperty({ 
    description: 'Tên nhà thuốc', 
    maxLength: 150,
    example: 'Nhà thuốc Long Châu'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Địa chỉ nhà thuốc',
    maxLength: 255,
    example: '456 Lê Lợi, Quận 1, TP.HCM'
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ 
    description: 'Vĩ độ',
    example: 10.762622,
    minimum: -90,
    maximum: 90
  })
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ 
    description: 'Kinh độ',
    example: 106.660172,
    minimum: -180,
    maximum: 180
  })
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude: number;

  @ApiProperty({ 
    description: 'Đánh giá nhà thuốc',
    example: 4.5,
    minimum: 0,
    maximum: 5
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiPropertyOptional({ 
    description: 'Số điện thoại',
    maxLength: 20,
    example: '+84-28-1234-5678'
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Google Place ID',
    maxLength: 100,
    example: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  googlePlaceId?: string;
}