import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { Comment } from 'src/entity/comment.entity';

@Injectable()
export class MypageRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findFavoriteToiletsBySocialId(socialId: string) {
    const favoriteToiletIds = await this.dataSource
      .getRepository(Favorite)
      .createQueryBuilder('favorite')
      .innerJoin('favorite.user', 'user')
      .where('user.social_id = :socialId', { socialId })
      .select('favorite.toilet_id', 'toiletId')
      .getRawMany();

    const toiletIds = favoriteToiletIds.map((fav) => fav.toiletId);
    if (toiletIds.length === 0) return [];

    return this.dataSource
      .createQueryBuilder(Toilet, 'toilet')
      .leftJoin('toilet.comments', 'comment', 'comment.deleted = false')
      .select([
        'toilet.id AS id',
        'toilet.name AS name',
        'toilet.street_address AS street_address',
        'toilet.lot_address AS lot_address',
        'toilet.latitude AS latitude',
        'toilet.longitude AS longitude',
        'ROUND(AVG(comment.rating_cleanliness), 1) AS avg_cleanliness',
        'ROUND(AVG(comment.rating_amenities), 1) AS avg_amenities',
        'ROUND(AVG(comment.rating_accessibility), 1) AS avg_accessibility',
      ])
      .whereInIds(toiletIds)
      .groupBy('toilet.id')
      .orderBy('toilet.id', 'DESC')
      .getRawMany();
  }

  async findReviewsBySocialId(socialId: string) {
    return this.dataSource
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.toilet', 'toilet')
      .innerJoin('comment.user', 'user')
      .where('user.social_id = :socialId', { socialId })
      .andWhere('comment.deleted=false')
      .select([
        'comment.id AS id',
        'comment.comment AS comment',
        'comment.rating_cleanliness AS avg_cleanliness',
        'comment.rating_amenities AS avg_amenities',
        'comment.rating_accessibility AS avg_accessibility',
        "TO_CHAR(comment.created_at, 'YYYY-MM-DD') AS created_at",
        "TO_CHAR(comment.updated_at, 'YYYY-MM-DD') AS updated_at",
        'toilet.id AS toilet_id',
        'toilet.name AS toilet_name',
        'toilet.latitude AS latitude',
        'toilet.longitude AS longitude',
      ])
      .orderBy('comment.id', 'DESC')
      .getRawMany();
  }
}
