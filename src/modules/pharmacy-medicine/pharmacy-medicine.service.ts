import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PharmacyMedicine } from './entities/pharmacy-medicine.entity';
import { CreatePharmacyMedicineDto } from './dto/create-pharmacy-medicine.dto';
import { UpdatePharmacyMedicineDto } from './dto/update-pharmacy-medicine.dto';

@Injectable()
export class PharmacyMedicineService {
  constructor(
    @InjectRepository(PharmacyMedicine)
    private readonly pharmacyMedicineRepository: Repository<PharmacyMedicine>,
  ) {}

  async create(createPharmacyMedicineDto: CreatePharmacyMedicineDto): Promise<PharmacyMedicine> {
    // Check if the pharmacy-medicine combination already exists
    const existing = await this.pharmacyMedicineRepository.findOne({
      where: {
        pharmacyId: createPharmacyMedicineDto.pharmacyId,
        medicineId: createPharmacyMedicineDto.medicineId,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Medicine with ID ${createPharmacyMedicineDto.medicineId} already exists in pharmacy with ID ${createPharmacyMedicineDto.pharmacyId}`
      );
    }

    const pharmacyMedicine = this.pharmacyMedicineRepository.create(createPharmacyMedicineDto);
    return await this.pharmacyMedicineRepository.save(pharmacyMedicine);
  }

  async findAll(): Promise<PharmacyMedicine[]> {
    return await this.pharmacyMedicineRepository.find({
      relations: ['pharmacy', 'medicine'],
    });
  }

  async findOne(id: number): Promise<PharmacyMedicine> {
    const pharmacyMedicine = await this.pharmacyMedicineRepository.findOne({
      where: { id },
      relations: ['pharmacy', 'medicine'],
    });

    if (!pharmacyMedicine) {
      throw new NotFoundException(`PharmacyMedicine with ID ${id} not found`);
    }

    return pharmacyMedicine;
  }

  async update(id: number, updatePharmacyMedicineDto: UpdatePharmacyMedicineDto): Promise<PharmacyMedicine> {
    const pharmacyMedicine = await this.findOne(id);
    
    Object.assign(pharmacyMedicine, updatePharmacyMedicineDto);
    return await this.pharmacyMedicineRepository.save(pharmacyMedicine);
  }

  async remove(id: number): Promise<void> {
    const pharmacyMedicine = await this.findOne(id);
    await this.pharmacyMedicineRepository.remove(pharmacyMedicine);
  }

  async findByPharmacy(pharmacyId: number): Promise<PharmacyMedicine[]> {
    return await this.pharmacyMedicineRepository.find({
      where: { pharmacyId },
      relations: ['pharmacy', 'medicine'],
    });
  }

  async findByMedicine(medicineId: number): Promise<PharmacyMedicine[]> {
    return await this.pharmacyMedicineRepository.find({
      where: { medicineId },
      relations: ['pharmacy', 'medicine'],
    });
  }

  async findMedicineInStock(medicineId: number, minStock: number = 1): Promise<PharmacyMedicine[]> {
    return await this.pharmacyMedicineRepository
      .createQueryBuilder('pm')
      .leftJoinAndSelect('pm.pharmacy', 'pharmacy')
      .leftJoinAndSelect('pm.medicine', 'medicine')
      .where('pm.medicineId = :medicineId', { medicineId })
      .andWhere('pm.stock >= :minStock', { minStock })
      .orderBy('pm.stock', 'DESC')
      .getMany();
  }

  async updateStock(id: number, newStock: number): Promise<PharmacyMedicine> {
    const pharmacyMedicine = await this.findOne(id);
    pharmacyMedicine.stock = newStock;
    return await this.pharmacyMedicineRepository.save(pharmacyMedicine);
  }
}