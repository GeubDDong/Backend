import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  async findLikedBySocialId(socialId: string, toiletId: number) {
    const result = await this.favoritesRepository.findOne({
      where: { user: { social_id: socialId }, toilet: { id: toiletId } },
    });

    return result;
  }

  async checkAlreadyLiked(userId: number, toiletId: number) {
    const result = await this.favoritesRepository.findOne({
      where: { user: { id: userId }, toilet: { id: toiletId } },
    });

    return result;
  }

  async createLike(user: User, toilet: Toilet): Promise<void> {
    const favoriteRepo = this.favoritesRepository;

    const newLike = favoriteRepo.create({ user, toilet });

    await favoriteRepo.save(newLike);
  }

  async deleteLike(user: User, toilet: Toilet): Promise<void> {
    const favoriteRepo = this.favoritesRepository;

    await favoriteRepo.delete({ user, toilet });
  }
  async findLikedToiletsByIds(
    toiletIds: number[],
    userId: number,
  ): Promise<{ toilet_id: number }[]> {
    return this.favoritesRepository
      .createQueryBuilder('favorite')
      .select('favorite.toilet_id')
      .where('favorite.user_id = :userId', { userId })
      .andWhere('favorite.toilet_id IN (:...toiletIds)', { toiletIds })
      .getRawMany();
  }
}
