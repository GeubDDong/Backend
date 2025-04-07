import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/user.service';
import { RedisService } from 'src/cache/redis.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly userService: UsersService,
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
    private readonly redisService: RedisService,
  ) {}

  // 비회원용 좋아요 조회
  async getLikesPublic(toiletId: number) {
    const cacheKey = `favorite:public:toilet:${toiletId}`;
    const cached = await this.redisService.get<{
      like: false;
      count: number;
    }>(cacheKey);

    if (cached) return cached;

    const count = await this.favoriteRepository.count({
      where: { toilet: { id: toiletId } },
    });

    const result = { like: false, count };
    await this.redisService.set(cacheKey, result, 60);

    return result;
  }

  // 회원용 좋아요 여부 + 총 개수
  async getLikes(toiletId: number, email: string) {
    const cacheKey = `favorite:user:${email}:toilet:${toiletId}`;
    const cached = await this.redisService.get<{
      like: boolean;
      count: number;
    }>(cacheKey);

    if (cached) return cached;

    const [count, user] = await Promise.all([
      this.favoriteRepository.count({
        where: { toilet: { id: toiletId } },
      }),
      this.userService.findByEmail(email),
    ]);

    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const hasLiked = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toiletId } },
    });

    const result = {
      like: !!hasLiked,
      count,
    };

    await this.redisService.set(cacheKey, result, 60);
    return result;
  }

  //좋아요 추가
  async addLike(email: string, toiletId: number) {
    const [user, toilet] = await Promise.all([
      this.userService.findByEmail(email),
      this.toiletRepository.findOne({ where: { id: toiletId } }),
    ]);

    if (!user || !toilet) {
      throw new NotFoundException('유저 또는 화장실 정보를 찾을 수 없습니다.');
    }

    const existingLike = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toilet.id } },
    });

    if (existingLike) {
      throw new ConflictException('이미 좋아요를 추가한 화장실입니다.');
    }

    const favorite = this.favoriteRepository.create({ user, toilet });
    await this.favoriteRepository.save(favorite);

    await this.invalidateCache(email, toiletId);
    return await this.favoriteRepository.count({
      where: { toilet: { id: toilet.id } },
    });
  }

  //좋아요 삭제
  async deleteLike(email: string, toiletId: number) {
    const [user, toilet] = await Promise.all([
      this.userService.findByEmail(email),
      this.toiletRepository.findOne({ where: { id: toiletId } }),
    ]);

    if (!user || !toilet) {
      throw new NotFoundException('유저 또는 화장실 정보를 찾을 수 없습니다.');
    }

    const existingLike = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toilet.id } },
    });

    if (!existingLike) {
      throw new ConflictException(
        '좋아요를 삭제할 화장실이 존재하지 않습니다.',
      );
    }

    await this.favoriteRepository.remove(existingLike);

    await this.invalidateCache(email, toiletId);

    return await this.favoriteRepository.count({
      where: { toilet: { id: toilet.id } },
    });
  }

  //캐시 무효화
  private async invalidateCache(email: string, toiletId: number) {
    const userKey = `favorite:user:${email},toilet:${toiletId}`;
    const publicKey = `favorite:public:toilet:${toiletId}`;

    await Promise.all([
      this.redisService.del(userKey),
      this.redisService.del(publicKey),
    ]);
  }
}
