import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Toilet } from './toilet.entity';

@Entity('toilet_facilities')
@Unique(['toilet'])
export class ToiletFacility {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @OneToOne(() => Toilet, (toilet) => toilet.facility, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toilet_id' })
  toilet: Toilet;

  @Column({ type: 'int', default: 0 })
  male_toilet: number;

  @Column({ type: 'int', default: 0 })
  male_urinal: number;

  @Column({ type: 'int', default: 0 })
  disabled_male_toilet: number;

  @Column({ type: 'int', default: 0 })
  disabled_male_urinal: number;

  @Column({ type: 'int', default: 0 })
  kids_toilet_male: number;

  @Column({ type: 'int', default: 0 })
  female_toilet: number;

  @Column({ type: 'int', default: 0 })
  disabled_female_toilet: number;

  @Column({ type: 'int', default: 0 })
  kids_toilet_female: number;

  @Column({ type: 'varchar', length: 1, default: 'N' })
  emergency_bell: string;

  @Column({ type: 'varchar', length: 1, default: 'N' })
  cctv: string;

  @Column({ type: 'varchar', length: 1, default: 'N' })
  diaper_changing_station: string;

  @Column({ type: 'date' })
  reference_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
