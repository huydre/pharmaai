import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { Medicine } from '../../medicine/entities/medicine.entity';
import { Pharmacy } from '../../pharmacy/entities/pharmacy.entity';

@Entity('pharmacy_medicines')
export class PharmacyMedicine {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyMedicines)
  @JoinColumn({ name: 'pharmacyId' })
  pharmacy: Pharmacy;

  @Column()
  pharmacyId: number;

  @ManyToOne(() => Medicine, (medicine) => medicine.pharmacyMedicines)
  @JoinColumn({ name: 'medicineId' })
  medicine: Medicine;

  @Column()
  medicineId: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    nullable: true 
  })
  priceOverride: number;

  @CreateDateColumn()
  updatedAt: Date;
}