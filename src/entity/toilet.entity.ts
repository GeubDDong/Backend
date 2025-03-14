import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserToiletCommentModel } from './user.toilet.comment.entity';
import { LikesModel } from './likes.entity';

@Entity()
export class ToiletModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  street_address: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  lot_address: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  disabled_male: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  kids_toilet_male: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  disabled_female: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  kids_toilet_female: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  management_agency: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: '정보 없음' })
  phone_number: string;

  @Column({ type: 'varchar', length: 50, nullable: true, default: '정보없음' })
  open_hour: string;

  @Column({ type: 'float8', nullable: true, default: 0.0 })
  latitude?: number;

  @Column({ type: 'float8', nullable: true, default: 0.0 })
  longitude?: number;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  emergency_bell: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  cctv: string;

  @Column({ type: 'varchar', length: 1, nullable: false, default: 'N' })
  diaper_changing_station: string;

  @Column({ type: 'date', nullable: true })
  data_reference_date: Date;

  @OneToMany(() => UserToiletCommentModel, (comment) => comment.toilet)
  comments: UserToiletCommentModel[];

  @OneToMany(() => LikesModel, (like) => like.toilet)
  likes: LikesModel[];
}
