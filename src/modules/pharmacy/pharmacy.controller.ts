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
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post()
  create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyService.create(createPharmacyDto);
  }

  @Get()
  findAll() {
    return this.pharmacyService.findAll();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return this.pharmacyService.findAll();
    }
    return this.pharmacyService.searchPharmacies(searchTerm);
  }

  @Get('nearby')
  findNearby(
    @Query('lat', ParseFloatPipe) latitude: number,
    @Query('lng', ParseFloatPipe) longitude: number,
    @Query('radius', ParseFloatPipe) radius?: number,
  ) {
    return this.pharmacyService.findNearby(latitude, longitude, radius);
  }

  @Get('by-rating')
  findByRating(@Query('min', ParseFloatPipe) minRating: number) {
    return this.pharmacyService.findByRating(minRating);
  }

  @Get('by-name/:name')
  findByName(@Param('name') name: string) {
    return this.pharmacyService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmacyService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.remove(id);
  }
}