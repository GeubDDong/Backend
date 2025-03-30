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

  @Column({ type: 'int' })
  rating_cleanliness: number;

  @Column({ type: 'int' })
  rating_amenities: number;

  @Column({ type: 'int' })
  rating_accessibility: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
