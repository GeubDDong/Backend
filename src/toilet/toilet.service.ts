import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { ToiletDto } from '../dto/toilet.dto';
import { FavoritesService } from 'src/favorite/favorites.service';
import { RedisService } from 'src/cache/redis.service';

@Injectable()
export class ToiletService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
    private readonly favoritesService: FavoritesService,
    private readonly redisService: RedisService,
  ) {}

  async getToilets(
    cenLat: number,
    cenLng: number,
    top: number,
    bottom: number,
    left: number,
    right: number,
    userEmail?: string,
  ): Promise<ToiletDto[]> {
    const cacheKey = `toilets:${cenLat}:${cenLng}:${top}:${bottom}:${left}:${right}:${userEmail || 'public'}`;
    const cached = await this.redisService.get<ToiletDto[]>(cacheKey);

    if (cached) {
      return cached;
    }

    console.log('db에서 가져옴');
    const toilets = await this.toiletRepository
      .createQueryBuilder('toilet')
      .leftJoinAndSelect('toilet.management', 'management')
      .leftJoinAndSelect('toilet.facility', 'facility')
      .addSelect(
        `ST_DistanceSphere(
          ST_MakePoint(toilet.longitude::float8, toilet.latitude::float8),
          ST_MakePoint(CAST(:cenLng AS float8), CAST(:cenLat AS float8))
        )`,
        'distance',
      )
      .where('toilet.latitude BETWEEN :bottom AND :top', { top, bottom })
      .andWhere('toilet.longitude BETWEEN :left AND :right', { left, right })
      .setParameters({ cenLat, cenLng })
      .orderBy('distance', 'ASC')
      .getMany();

    const result = await Promise.all(
      toilets.map(async (toilet, index) => {
        let liked = { like: false };

        if (userEmail) {
          const result = await this.favoritesService.getLiked(
            toilet.id,
            userEmail,
          );
          liked = { like: result.like };
        }

        return {
          id: toilet.id,
          name: toilet.name,
          street_address: toilet.street_address,
          lot_address: toilet.lot_address,
          latitude: toilet.latitude,
          longitude: toilet.longitude,
          open_hours: toilet.open_hour,
          liked,
          nearest: index === 0,
        };
      }),
    );
    await this.redisService.set(cacheKey, result, 300);
    return result;
  }
}
