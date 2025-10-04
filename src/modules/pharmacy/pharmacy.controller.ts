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
  ParseFloatPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@ApiTags('pharmacies')
@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pharmacy' })
  @ApiResponse({ status: 201, description: 'Pharmacy created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyService.create(createPharmacyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pharmacies' })
  @ApiResponse({ status: 200, description: 'List of pharmacies retrieved successfully' })
  findAll() {
    return this.pharmacyService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search pharmacies by name or address' })
  @ApiQuery({ name: 'q', description: 'Search term', required: false })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return this.pharmacyService.findAll();
    }
    return this.pharmacyService.searchPharmacies(searchTerm);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby pharmacies using GPS coordinates' })
  @ApiQuery({ name: 'lat', description: 'Latitude', type: 'number' })
  @ApiQuery({ name: 'lng', description: 'Longitude', type: 'number' })
  @ApiQuery({ name: 'radius', description: 'Search radius in kilometers', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Nearby pharmacies retrieved successfully' })
  findNearby(
    @Query('lat', ParseFloatPipe) latitude: number,
    @Query('lng', ParseFloatPipe) longitude: number,
    @Query('radius', ParseFloatPipe) radius?: number,
  ) {
    return this.pharmacyService.findNearby(latitude, longitude, radius);
  }

  @Get('by-rating')
  @ApiOperation({ summary: 'Get pharmacies by minimum rating' })
  @ApiQuery({ name: 'min', description: 'Minimum rating', type: 'number' })
  @ApiResponse({ status: 200, description: 'Pharmacies with high rating retrieved successfully' })
  findByRating(@Query('min', ParseFloatPipe) minRating: number) {
    return this.pharmacyService.findByRating(minRating);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get pharmacies by exact name' })
  @ApiParam({ name: 'name', description: 'Pharmacy name' })
  @ApiResponse({ status: 200, description: 'Pharmacies with the name retrieved successfully' })
  findByName(@Param('name') name: string) {
    return this.pharmacyService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pharmacy by ID' })
  @ApiParam({ name: 'id', description: 'Pharmacy ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pharmacy by ID' })
  @ApiParam({ name: 'id', description: 'Pharmacy ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy updated successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmacyService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pharmacy by ID' })
  @ApiParam({ name: 'id', description: 'Pharmacy ID' })
  @ApiResponse({ status: 200, description: 'Pharmacy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pharmacy not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.remove(id);
  }
}