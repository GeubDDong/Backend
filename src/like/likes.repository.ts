import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly likesRepository: Repository<Favorite>,
  ) {}

  async findLikedBySocialId(socialId: string, toiletId: number) {
    const result = await this.likesRepository.findOne({
      where: { user: { social_id: socialId }, toilet: { id: toiletId } },
    });

    return result;
  }

  async checkAlreadyLiked(userId: number, toiletId: number) {
    const result = await this.likesRepository.findOne({
      where: { user: { id: userId }, toilet: { id: toiletId } },
    });

    return result;
  }

  async createLike(user: User, toilet: Toilet): Promise<void> {
    const favoriteRepo = this.likesRepository;

    const newLike = favoriteRepo.create({ user, toilet });

    await favoriteRepo.save(newLike);
  }

  async deleteLike(user: User, toilet: Toilet): Promise<void> {
    const favoriteRepo = this.likesRepository;

    await favoriteRepo.delete({ user, toilet });
  }
}
