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
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';

@Entity('toilets')
export class Toilet {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  street_address: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  lot_address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ nullable: true })
  open_hour: string;

  @Column({ type: 'float', default: 0 })
  avg_rating: number;

  @Column({ type: 'float', default: 0 })
  avg_cleanliness: number;

  @Column({ type: 'float', default: 0 })
  avg_amenities: number;

  @Column({ type: 'float', default: 0 })
  avg_accessibility: number;

  @Column({ default: 0 })
  comment_count: number;

  @ManyToOne(() => Management, (management) => management.toilets)
  @JoinColumn({ name: 'management_id' })
  management: Management;

  @OneToOne(() => ToiletFacility, (facility) => facility.toilet, {
    cascade: true,
  })
  facility: ToiletFacility;

  @OneToMany(() => Comment, (comment) => comment.toilet)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.toilet)
  favorites: Favorite[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
