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

  async findToilets(latitude: number, longitude: number, userId?: string) {
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
        'ST_Distance_Sphere(toilet.longitude,toilet.latitude),point(:longitude,:latitude)) AS distance',
        userId
          ? 'IF(liked.id IS NOT NULL,TRUE,FALSE) AS liked'
          : 'FALSE AS liked',
      ])
      .from(ToiletModel, 'toilet')
      .leftJoin(
        LikesModel,
        'likes',
        'likes.toilet_id=toilet.id AND likes.user_id=:userId',
        { userId },
      )
      .setParameters({ latitude: latitude, longitude: longitude })
      .orderBy('distance', 'ASC')
      .limit(10)
      .getRawMany();
  }

  async getLikeCount(toiletId: number): Promise<number> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(LikesModel, 'likes')
      .where('likes.toilet_id=:toiletId', { toiletId })
      .getRawOne();

    return result?.count ?? 0;
  }
}
