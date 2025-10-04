import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PharmacyMedicineService } from './pharmacy-medicine.service';
import { CreatePharmacyMedicineDto } from './dto/create-pharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/update-pharmacy-medicine.dto';

@Controller('pharmacy-medicines')
export class PharmacyMedicineController {
  constructor(private readonly pharmacyMedicineService: PharmacyMedicineService) {}

  @Post()
  create(@Body() createPharmacyMedicineDto: CreatePharmacyMedicineDto) {
    return this.pharmacyMedicineService.create(createPharmacyMedicineDto);
  }

  @Get()
  findAll() {
    return this.pharmacyMedicineService.findAll();
  }

  @Get('pharmacy/:pharmacyId')
  findByPharmacy(@Param('pharmacyId', ParseIntPipe) pharmacyId: number) {
    return this.pharmacyMedicineService.findByPharmacy(pharmacyId);
  }

  @Get('medicine/:medicineId')
  findByMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.pharmacyMedicineService.findByMedicine(medicineId);
  }

  @Get('medicine/:medicineId/in-stock')
  findMedicineInStock(
    @Param('medicineId', ParseIntPipe) medicineId: number,
    @Query('minStock', ParseIntPipe) minStock?: number,
  ) {
    return this.pharmacyMedicineService.findMedicineInStock(medicineId, minStock);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyMedicineService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePharmacyMedicineDto: UpdatePharmacyMedicineDto,
  ) {
    return this.pharmacyMedicineService.update(id, updatePharmacyMedicineDto);
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('stock', ParseIntPipe) newStock: number,
  ) {
    return this.pharmacyMedicineService.updateStock(id, newStock);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyMedicineService.remove(id);
  }
}