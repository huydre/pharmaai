import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyMedicineService } from './pharmacy-medicine.service';
import { PharmacyMedicineController } from './pharmacy-medicine.controller';
import { PharmacyMedicine } from './entities/pharmacy-medicine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyMedicine])],
  controllers: [PharmacyMedicineController],
  providers: [PharmacyMedicineService],
  exports: [PharmacyMedicineService],
})
export class PharmacyMedicineModule {}