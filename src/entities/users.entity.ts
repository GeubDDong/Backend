import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserToiletCommentModel } from './user.toilet.comment.entity';
import { LikesModel } from './likes.entity';

@Entity()
export class UsersModel {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  nickname: string;

  @Column()
  provider: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  profile_image: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  refresh_token?: string | null;

  @OneToMany(() => UserToiletCommentModel, (comment) => comment.user)
  comments: UserToiletCommentModel[];

  @OneToMany(() => LikesModel, (like) => like.user)
  likes: LikesModel[];
}
