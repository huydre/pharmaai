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
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Controller('medicines')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  findAll() {
    return this.medicineService.findAll();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return this.medicineService.findAll();
    }
    return this.medicineService.searchMedicines(searchTerm);
  }

  @Get('by-disease/:disease')
  findByDisease(@Param('disease') disease: string) {
    return this.medicineService.findByDisease(disease);
  }

  @Get('by-name/:name')
  findByName(@Param('name') name: string) {
    return this.medicineService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicineService.remove(id);
  }
}