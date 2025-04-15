import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Toilet } from './toilet.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Toilet, (toilet) => toilet.comments)
  @JoinColumn({ name: 'toilet_id' })
  toilet: Toilet;

  @Column({ type: 'float', default: 0 })
  avg_rating: number;

  @Column({ type: 'int' })
  rating_cleanliness: number;

  @Column({ type: 'int' })
  rating_amenities: number;

  @Column({ type: 'int' })
  rating_accessibility: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;
}
