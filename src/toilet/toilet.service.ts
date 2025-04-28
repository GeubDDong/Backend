import { Injectable } from '@nestjs/common';
import { FavoritesService } from 'src/favorite/favorites.service';
import {
  ToiletMapResponseDto,
  ToiletMapResponseWrapperDto,
  ToiletSummaryDto,
} from 'src/dto/toilet/response/toilet-response.dto';
import { ToiletRepository } from './toilet.repository';
import { ToiletMapRequestDto } from 'src/dto/toilet/request/toilet-request.dto';

@Injectable()
export class ToiletService {
  constructor(
    private readonly toiletRepository: ToiletRepository,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getToilets(
    request: ToiletMapRequestDto,
    userSocialId?: string,
  ): Promise<ToiletMapResponseWrapperDto> {
    const { bounds, filters } = request;
    const { cenLat, cenLng, top, bottom, left, right } = bounds;

    const toilets = await this.toiletRepository.findToiletsInBounds(
      cenLat,
      cenLng,
      top,
      bottom,
      left,
      right,
      filters,
    );

    const toiletIds = toilets.map((toilet) => toilet.id);

    // 만약 user가 로그인한 경우, 내가 좋아요한 화장실 ID 리스트를 가져온다
    const likedToiletIds = userSocialId
      ? await this.favoritesService.findLikedToiletIds(userSocialId, toiletIds)
      : [];

    const toiletDtos = toilets.map((toilet) => ({
      id: toilet.id,
      name: toilet.name,
      is_liked: likedToiletIds.includes(toilet.id),
      marker_latitude: Number(toilet.latitude.toFixed(4)),
      marker_longitude: Number(toilet.longitude.toFixed(4)),
    }));

    const groupedToilets = this.groupToiletsByMarker(toiletDtos);

    return { groups: groupedToilets };
  }

  private groupToiletsByMarker(
    toiletDtos: (ToiletSummaryDto & {
      marker_latitude: number;
      marker_longitude: number;
    })[],
  ): ToiletMapResponseDto[] {
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

    return Object.values(grouped);
  }
}
