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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@ApiTags('medicines')
@Controller('medicines')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medicine' })
  @ApiResponse({ status: 201, description: 'Medicine created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medicines' })
  @ApiResponse({ status: 200, description: 'List of medicines retrieved successfully' })
  findAll() {
    return this.medicineService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search medicines by name, description, or related disease' })
  @ApiQuery({ name: 'q', description: 'Search term', required: false })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return this.medicineService.findAll();
    }
    return this.medicineService.searchMedicines(searchTerm);
  }

  @Get('by-disease/:disease')
  @ApiOperation({ summary: 'Get medicines by related disease' })
  @ApiParam({ name: 'disease', description: 'Disease name' })
  @ApiResponse({ status: 200, description: 'Medicines for the disease retrieved successfully' })
  findByDisease(@Param('disease') disease: string) {
    return this.medicineService.findByDisease(disease);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get medicines by exact name' })
  @ApiParam({ name: 'name', description: 'Medicine name' })
  @ApiResponse({ status: 200, description: 'Medicines with the name retrieved successfully' })
  findByName(@Param('name') name: string) {
    return this.medicineService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine updated successfully' })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicineService.remove(id);
  }
}