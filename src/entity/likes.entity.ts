import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UsersModel } from './users.entity';
import { ToiletModel } from './toilet.entity';

@Entity()
export class LikesModel {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  user_email: string;

  @PrimaryColumn()
  toilet_id: number;

  @ManyToOne(() => UsersModel, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_email' })
  user: UsersModel;

  @ManyToOne(() => ToiletModel, (toilet) => toilet.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toilet_id' })
  toilet: ToiletModel;
}
