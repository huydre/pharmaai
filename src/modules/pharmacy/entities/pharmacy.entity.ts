import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PharmacyMedicine } from '../../pharmacy-medicine/entities/pharmacy-medicine.entity';

@Entity('pharmacies')
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'float' })
  rating: number;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  googlePlaceId: string;

  @OneToMany(() => PharmacyMedicine, (pharmacyMedicine) => pharmacyMedicine.pharmacy)
  pharmacyMedicines: PharmacyMedicine[];
}