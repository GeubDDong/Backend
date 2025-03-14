import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersModel } from './user.entity';
import { ToiletModel } from './toilet.entity';

@Entity()
export class UserToiletCommentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UsersModel, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_email', referencedColumnName: 'email' })
  user: UsersModel;

  @ManyToOne(() => ToiletModel, (toilet) => toilet.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toilet_id' })
  toilet: ToiletModel;
}
