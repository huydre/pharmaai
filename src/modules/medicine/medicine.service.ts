import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const medicine = this.medicineRepository.create(createMedicineDto);
    return await this.medicineRepository.save(medicine);
  }

  async findAll(): Promise<Medicine[]> {
    return await this.medicineRepository.find({
      relations: ['pharmacyMedicines'],
    });
  }

  async findOne(id: number): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
      relations: ['pharmacyMedicines', 'pharmacyMedicines.pharmacy'],
    });

    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }

    return medicine;
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    const medicine = await this.findOne(id);
    
    Object.assign(medicine, updateMedicineDto);
    return await this.medicineRepository.save(medicine);
  }

  async remove(id: number): Promise<void> {
    const medicine = await this.findOne(id);
    await this.medicineRepository.remove(medicine);
  }

  async findByName(name: string): Promise<Medicine[]> {
    return await this.medicineRepository.find({
      where: { name: name },
      relations: ['pharmacyMedicines', 'pharmacyMedicines.pharmacy'],
    });
  }

  async findByDisease(disease: string): Promise<Medicine[]> {
    return await this.medicineRepository.find({
      where: { relatedDisease: disease },
      relations: ['pharmacyMedicines', 'pharmacyMedicines.pharmacy'],
    });
  }

  async searchMedicines(searchTerm: string): Promise<Medicine[]> {
    return await this.medicineRepository
      .createQueryBuilder('medicine')
      .leftJoinAndSelect('medicine.pharmacyMedicines', 'pharmacyMedicine')
      .leftJoinAndSelect('pharmacyMedicine.pharmacy', 'pharmacy')
      .where('medicine.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('medicine.description LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('medicine.relatedDisease LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .getMany();
  }
}