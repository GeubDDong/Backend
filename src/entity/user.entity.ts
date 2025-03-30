import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ unique: true })
  social_id: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 10 })
  provider: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  refresh_token: string;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
