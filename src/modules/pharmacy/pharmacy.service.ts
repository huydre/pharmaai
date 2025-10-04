import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacy } from './entities/pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
  ) {}

  async create(createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    const pharmacy = this.pharmacyRepository.create(createPharmacyDto);
    return await this.pharmacyRepository.save(pharmacy);
  }

  async findAll(): Promise<Pharmacy[]> {
    return await this.pharmacyRepository.find({
      relations: ['pharmacyMedicines'],
    });
  }

  async findOne(id: number): Promise<Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findOne({
      where: { id },
      relations: ['pharmacyMedicines', 'pharmacyMedicines.medicine'],
    });

    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with ID ${id} not found`);
    }

    return pharmacy;
  }

  async update(id: number, updatePharmacyDto: UpdatePharmacyDto): Promise<Pharmacy> {
    const pharmacy = await this.findOne(id);
    
    Object.assign(pharmacy, updatePharmacyDto);
    return await this.pharmacyRepository.save(pharmacy);
  }

  async remove(id: number): Promise<void> {
    const pharmacy = await this.findOne(id);
    await this.pharmacyRepository.remove(pharmacy);
  }

  async findByName(name: string): Promise<Pharmacy[]> {
    return await this.pharmacyRepository.find({
      where: { name: name },
      relations: ['pharmacyMedicines', 'pharmacyMedicines.medicine'],
    });
  }

  async findNearby(latitude: number, longitude: number, radius: number = 10): Promise<Pharmacy[]> {
    // Using Haversine formula to find nearby pharmacies
    return await this.pharmacyRepository
      .createQueryBuilder('pharmacy')
      .leftJoinAndSelect('pharmacy.pharmacyMedicines', 'pharmacyMedicine')
      .leftJoinAndSelect('pharmacyMedicine.medicine', 'medicine')
      .addSelect(
        `( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( pharmacy.latitude ) ) * cos( radians( pharmacy.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( pharmacy.latitude ) ) ) )`,
        'distance'
      )
      .where(
        `( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( pharmacy.latitude ) ) * cos( radians( pharmacy.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( pharmacy.latitude ) ) ) ) < ${radius}`
      )
      .orderBy('distance', 'ASC')
      .getMany();
  }

  async findByRating(minRating: number): Promise<Pharmacy[]> {
    return await this.pharmacyRepository.find({
      where: { rating: minRating },
      relations: ['pharmacyMedicines', 'pharmacyMedicines.medicine'],
      order: { rating: 'DESC' },
    });
  }

  async searchPharmacies(searchTerm: string): Promise<Pharmacy[]> {
    return await this.pharmacyRepository
      .createQueryBuilder('pharmacy')
      .leftJoinAndSelect('pharmacy.pharmacyMedicines', 'pharmacyMedicine')
      .leftJoinAndSelect('pharmacyMedicine.medicine', 'medicine')
      .where('pharmacy.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('pharmacy.address LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .getMany();
  }
}