import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { RedisService } from 'src/cache/redis.service';
import { FavoriteRepository } from './favorites.repository';
import { UsersRepository } from 'src/user/user.repository';
import { ToiletRepository } from 'src/toilet/toilet.repository';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoriteRepository,
    private readonly usersRepository: UsersRepository,
    private readonly toiletsRepository: ToiletRepository,
  ) {}

  async getLiked(toiletId: number, socialId: string) {
    const user = await this.usersRepository.findBySocialId(socialId);

    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const hasLiked = await this.favoritesRepository.findLikedBySocialId(
      socialId,
      toiletId,
    );

    const result = {
      like: !!hasLiked,
    };

    return result;
  }

  async addLike(socialId: string, toiletId: number) {
    const [user, toilet] = await Promise.all([
      this.usersRepository.findBySocialId(socialId),
      this.toiletsRepository.findOneByToiletId(toiletId),
    ]);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (!toilet) {
      throw new NotFoundException(
        `${toiletId}에 해당하는 화장실 정보를 찾을 수 없습니다.`,
      );
    }

    const userId = user.id;
    const existingLike = await this.favoritesRepository.checkAlreadyLiked(
      userId,
      toiletId,
    );

    if (existingLike) {
      throw new ConflictException('이미 좋아요를 추가한 화장실입니다.');
    }

    return await this.favoritesRepository.createLike(user, toilet);
  }

  async deleteLike(socialId: string, toiletId: number) {
    const [user, toilet] = await Promise.all([
      this.usersRepository.findBySocialId(socialId),
      this.toiletsRepository.findOneByToiletId(toiletId),
    ]);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (!toilet) {
      throw new NotFoundException(
        `${toiletId}에 해당하는 화장실 정보를 찾을 수 없습니다.`,
      );
    }

    const userId = user.id;
    const existingLike = await this.favoritesRepository.checkAlreadyLiked(
      userId,
      toiletId,
    );

    if (!existingLike) {
      throw new ConflictException(
        '좋아요를 삭제할 화장실이 존재하지 않습니다.',
      );
    }

    return await this.favoritesRepository.deleteLike(user, toilet);
  }
}
