import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  MyFavoriteToiletDto,
  MyReviewDto,
} from 'src/dto/mypage/response/mypage-response.dto';

@Injectable()
export class MypageRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findFavoriteToiletsBySocialId(
    socialId: string,
  ): Promise<MyFavoriteToiletDto[]> {
    return await this.dataSource.query(
      `
      SELECT
        t.id,
        t.name,
        t.street_address,
        t.lot_address,
        ROUND(AVG(r.cleanliness)::numeric, 1) AS avg_cleanliness,
        ROUND(AVG(r.amenities)::numeric, 1) AS avg_amenities,
        ROUND(AVG(r.accessibility)::numeric, 1) AS avg_accessibility
      FROM favorites f
      JOIN users u ON u.id = f.user_id
      JOIN toilets t ON t.id = f.toilet_id
      LEFT JOIN reviews r ON r.toilet_id = t.id
      WHERE u.social_id = $1
      GROUP BY t.id
      ORDER BY t.id DESC
      `,
      [socialId],
    );
  }

  async findReviewsBySocialId(socialId: string): Promise<MyReviewDto[]> {
    return await this.dataSource.query(
      `
      SELECT
        r.id,
        r.comment,
        ROUND(r.cleanliness + r.amenities + r.accessibility) / 3 AS avg_rating,
        TO_CHAR(r.created_at, 'YYYY-MM-DD') AS created_at,
        TO_CHAR(r.updated_at, 'YYYY-MM-DD') AS updated_at,
        u.nickname,
        u.profile_image,
        json_build_object(
          'id', t.id,
          'name', t.name
        ) AS toilet
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      JOIN toilets t ON t.id = r.toilet_id
      WHERE u.social_id = $1
      ORDER BY r.id DESC
      `,
      [socialId],
    );
  }
}
