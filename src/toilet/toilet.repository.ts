import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Toilet } from '../entity/toilet.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
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
    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'toilet.id AS id',
        'toilet.name AS name',
        'toilet.latitude AS latitude',
        'toilet.longitude AS longitude',
        'toilet.street_address AS street_address',
        'toilet.lot_address AS lot_address',
        'toilet.open_hour AS open_hour',
        `ST_DistanceSphere(ST_MakePoint(toilet.longitude, toilet.latitude), ST_MakePoint(:cenLng, :cenLat)) AS distance`,
        userEmail
          ? `CASE WHEN "likes"."id" IS NOT NULL THEN TRUE ELSE FALSE END AS liked`
          : `FALSE AS liked`,
      ])
      .from(Toilet, 'toilet')
      .leftJoin(
        Favorite,
        'likes',
        'likes.toilet_id = toilet.id AND likes.user_id = :userEmail',
        {
          userEmail,
        },
      )
      .where('toilet.latitude BETWEEN :bottom AND :top', { top, bottom })
      .andWhere('toilet.longitude BETWEEN :left AND :right', { left, right })
      .setParameters({ cenLat, cenLng })
      .orderBy('distance', 'ASC')
      .limit(10);

    return await qb.getRawMany();
  }

  async getLikeCount(toiletId: number): Promise<number> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Favorite, 'likes')
      .where('likes.toilet_id = :toiletId', { toiletId })
      .getRawOne();

    return Number(result?.count ?? 0);
  }
}
