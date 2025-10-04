import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicineDto {
  @ApiProperty({ 
    description: 'Tên thuốc', 
    maxLength: 100,
    example: 'Paracetamol 500mg'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Mô tả thuốc',
    example: 'Giảm đau và hạ sốt'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Hướng dẫn sử dụng',
    maxLength: 255,
    example: 'Uống 1-2 viên mỗi 4-6 giờ khi cần'
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  usage?: string;

  @ApiPropertyOptional({ 
    description: 'Tác dụng phụ của thuốc',
    example: 'Có thể gây buồn ngủ, buồn nôn'
  })
  @IsString()
  @IsOptional()
  sideEffects?: string;

  @ApiProperty({ 
    description: 'Giá thuốc',
    example: 50000,
    type: 'number',
    format: 'int',
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ 
    description: 'Bệnh liên quan',
    maxLength: 100,
    example: 'Đau đầu, sốt'
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  relatedDisease?: string;
}