import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Management } from './management.entity';
import { ToiletFacility } from './toilet_facility.entity';
import { Review } from './review.entity';
import { Favorite } from './favorite.entity';

@Entity('toilets')
export class Toilet {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  street_address: string;

  @Column()
  lot_address: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column()
  open_hour: string;

  @Column({ type: 'float', default: 0 })
  avg_cleanliness: number;

  @Column({ type: 'float', default: 0 })
  avg_amenities: number;

  @Column({ type: 'float', default: 0 })
  avg_accessibility: number;

  @Column({ default: 0 })
  review_count: number;

  @ManyToOne(() => Management, (management) => management.toilets)
  @JoinColumn({ name: 'management_id' })
  management: Management;

  @OneToOne(() => ToiletFacility, (facility) => facility.toilet, {
    cascade: true,
  })
  facility: ToiletFacility;

  @OneToMany(() => Review, (review) => review.toilet)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.toilet)
  favorites: Favorite[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
