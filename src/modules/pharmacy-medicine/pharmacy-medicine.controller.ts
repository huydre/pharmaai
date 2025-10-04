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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PharmacyMedicineService } from './pharmacy-medicine.service';
import { CreatePharmacyMedicineDto } from './dto/create-pharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/update-pharmacy-medicine.dto';

@ApiTags('pharmacy-medicines')
@Controller('pharmacy-medicines')
export class PharmacyMedicineController {
  constructor(private readonly pharmacyMedicineService: PharmacyMedicineService) {}

  @Post()
  @ApiOperation({ summary: 'Add medicine to pharmacy inventory' })
  @ApiResponse({ status: 201, description: 'Medicine added to pharmacy successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Medicine already exists in this pharmacy' })
  create(@Body() createPharmacyMedicineDto: CreatePharmacyMedicineDto) {
    return this.pharmacyMedicineService.create(createPharmacyMedicineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pharmacy-medicine relations' })
  @ApiResponse({ status: 200, description: 'List of pharmacy medicines retrieved successfully' })
  findAll() {
    return this.pharmacyMedicineService.findAll();
  }

  @Get('pharmacy/:pharmacyId')
  @ApiOperation({ summary: 'Get all medicines in a specific pharmacy' })
  @ApiParam({ name: 'pharmacyId', description: 'Pharmacy ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy medicines retrieved successfully' })
  findByPharmacy(@Param('pharmacyId', ParseIntPipe) pharmacyId: number) {
    return this.pharmacyMedicineService.findByPharmacy(pharmacyId);
  }

  @Get('medicine/:medicineId')
  @ApiOperation({ summary: 'Get all pharmacies that have a specific medicine' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Pharmacies with the medicine retrieved successfully' })
  findByMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.pharmacyMedicineService.findByMedicine(medicineId);
  }

  @Get('medicine/:medicineId/in-stock')
  @ApiOperation({ summary: 'Get pharmacies that have a medicine in stock' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiQuery({ name: 'minStock', description: 'Minimum stock quantity', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Pharmacies with medicine in stock retrieved successfully' })
  findMedicineInStock(
    @Param('medicineId', ParseIntPipe) medicineId: number,
    @Query('minStock', ParseIntPipe) minStock?: number,
  ) {
    return this.pharmacyMedicineService.findMedicineInStock(medicineId, minStock);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pharmacy-medicine relation by ID' })
  @ApiParam({ name: 'id', description: 'Pharmacy Medicine ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy medicine retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyMedicineService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pharmacy-medicine relation' })
  @ApiParam({ name: 'id', description: 'Pharmacy Medicine ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy medicine updated successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePharmacyMedicineDto: UpdatePharmacyMedicineDto,
  ) {
    return this.pharmacyMedicineService.update(id, updatePharmacyMedicineDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update stock quantity' })
  @ApiParam({ name: 'id', description: 'Pharmacy Medicine ID' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        stock: { type: 'number', example: 25 } 
      } 
    } 
  })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found' })
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('stock', ParseIntPipe) newStock: number,
  ) {
    return this.pharmacyMedicineService.updateStock(id, newStock);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove medicine from pharmacy' })
  @ApiParam({ name: 'id', description: 'Pharmacy Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine removed from pharmacy successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy medicine not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyMedicineService.remove(id);
  }
}