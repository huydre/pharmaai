import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PharmacyMedicine } from '../../pharmacy-medicine/entities/pharmacy-medicine.entity';

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  usage: string;

  @Column({ type: 'text', nullable: true })
  sideEffects: string;

  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ length: 100, nullable: true })
  relatedDisease: string;

  @OneToMany(() => PharmacyMedicine, (pharmacyMedicine) => pharmacyMedicine.medicine)
  pharmacyMedicines: PharmacyMedicine[];
}