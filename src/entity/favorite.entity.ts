import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Toilet } from './toilet.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Toilet, (toilet) => toilet.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toilet_id' })
  toilet: Toilet;

  @CreateDateColumn()
  created_at: Date;
}
