import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { ToiletDto } from '../dto/toilet.dto';
import { LikesService } from 'src/like/likes.service';

@Injectable()
export class ToiletService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
    private readonly likeService: LikesService,
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
    const toilets = await this.toiletRepository
      .createQueryBuilder('toilet')
      .leftJoinAndSelect('toilet.favorites', 'favorites')
      .where('toilet.latitude BETWEEN :bottom AND :top', { top, bottom })
      .andWhere('toilet.longitude BETWEEN :left AND :right', { left, right })
      .getMany();

    return await Promise.all(
      toilets.map(async (toilet) => {
        let liked = { like: false };

        if (userEmail) {
          const result = await this.likeService.getLikes(toilet.id, userEmail);
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
          nearest: false,
        };
      }),
    );
  }
}
