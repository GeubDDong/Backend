import { Injectable } from '@nestjs/common';
import { FavoritesService } from 'src/favorite/favorites.service';
import { RedisService } from 'src/cache/redis.service';
import { ToiletMapResponseDto } from 'src/dto/toilet/toilet-response.dto';
import { ToiletRepository } from './toilet.repository';
import { ToiletFilterDto } from 'src/dto/toilet/request/toilet-filter.dto';

@Injectable()
export class ToiletService {
  constructor(
    private readonly toiletRepository: ToiletRepository,
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
    userSocialId?: string,
    filters?: ToiletFilterDto,
  ): Promise<{ groups: ToiletMapResponseDto[] }> {
    const filterKey = Object.entries(filters || {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('|');

    const cacheKey = `toilets:${cenLat}:${cenLng}:${top}:${bottom}:${left}:${right}:${userSocialId || 'public'}:filters:${filterKey}`;
    const cached = await this.redisService.get<{
      groups: ToiletMapResponseDto[];
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const toilets = await this.toiletRepository.findToiletsInBounds(
      cenLat,
      cenLng,
      top,
      bottom,
      left,
      right,
      filters,
    );

    const toiletDtos = await Promise.all(
      toilets.map(async (toilet) => {
        let isLiked = false;
        if (userSocialId) {
          const result = await this.favoritesService.getLiked(
            toilet.id,
            userSocialId,
          );
          isLiked = result.like;
        }
        return {
          id: toilet.id,
          name: toilet.name,
          is_liked: isLiked,
          marker_latitude: Number(toilet.latitude.toFixed(4)),
          marker_longitude: Number(toilet.longitude.toFixed(4)),
        };
      }),
    );

    const grouped: Record<string, ToiletMapResponseDto> = {};
    for (const toilet of toiletDtos) {
      const key = `${toilet.marker_latitude}-${toilet.marker_longitude}`;

      if (!grouped[key]) {
        grouped[key] = {
          marker_latitude: toilet.marker_latitude,
          marker_longitude: toilet.marker_longitude,
          toilets: [],
        };
      }
      grouped[key].toilets.push({
        id: toilet.id,
        name: toilet.name,
        is_liked: toilet.is_liked,
      });
    }

    const response = {
      groups: Object.values(grouped),
    };
    await this.redisService.set(cacheKey, response, 300);
    return response;
  }
}
