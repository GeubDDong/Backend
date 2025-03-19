import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesModel } from 'src/entity/likes.entity';
import { ToiletModel } from 'src/entity/toilet.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(ToiletModel)
    private readonly toiletRepository: Repository<ToiletModel>,
    private readonly dataSource: DataSource,
  ) {}

  async findToilets(
    cenLat: number,
    cenLng: number,
    top: number,
    bottom: number,
    left: number,
    right: number,
    userEmail?: string,
  ) {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'toilet.id',
        'toilet.name',
        'toilet.latitude',
        'toilet.longitude',
        'toilet.street_address',
        'toilet.lot_address',
        'toilet.open_hour',
        'ST_DistanceSphere(ST_MakePoint(toilet.longitude, toilet.latitude), ST_MakePoint(:cenLng, :cenLat)) AS distance',
        userEmail
          ? 'CASE WHEN likes.user_email IS NOT NULL THEN TRUE ELSE FALSE END AS liked'
          : 'FALSE AS liked',
      ])
      .from(ToiletModel, 'toilet')
      .leftJoin(
        LikesModel,
        'likes',
        'likes.toilet_id = toilet.id AND likes.user_email = :userEmail',
        { userEmail },
      )
      .where('toilet.latitude BETWEEN :bottom AND :top', { top, bottom })
      .andWhere('toilet.longitude BETWEEN :left AND :right', { left, right })
      .setParameters({ cenLat, cenLng })
      .orderBy('distance', 'ASC')
      .limit(10)
      .getRawMany();
  }

  async getLikeCount(toiletId: number): Promise<number> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(LikesModel, 'likes')
      .where('likes.toilet_id = :toiletId', { toiletId })
      .getRawOne();

    return result?.count ?? 0;
  }
}
