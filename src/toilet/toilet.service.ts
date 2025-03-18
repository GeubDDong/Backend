import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToiletModel } from '../entity/toilet.entity';
import { ToiletDto } from '../dto/toilet.dto';
import { LikesService } from 'src/like/likes.service';

@Injectable()
export class ToiletService {
  constructor(
    @InjectRepository(ToiletModel)
    private readonly toiletRepository: Repository<ToiletModel>,
    private readonly likeService: LikesService,
  ) {}

  async getToilets(
    latitude: number,
    longitude: number,
    userEmail?: string,
  ): Promise<ToiletDto[]> {
    const toilets = await this.toiletRepository
      .createQueryBuilder('toilet')
      .leftJoinAndSelect('toilet.likes', 'likes')
      .loadRelationCountAndMap('toilet.likeCount', 'toilet.likes')
      .getMany();

    return await Promise.all(
      toilets.map(async (toilet) => {
        let likeData;
        if (userEmail) {
          likeData = await this.likeService.getLikes(toilet.id, userEmail);
        } else {
          likeData = await this.likeService.getLikesPublic(toilet.id);
        }
        return {
          id: toilet.id,
          name: toilet.name,
          street_address: toilet.street_address,
          lot_address: toilet.lot_address,
          latitude: toilet.latitude,
          longitude: toilet.longitude,
          open_hours: toilet.open_hour,
          liked: likeData,
          nearest: false,
        };
      }),
    );
  }
}
