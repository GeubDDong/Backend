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

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly userService: UsersService,
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async getLikesPublic(toiletId: number) {
    const likes = await this.favoriteRepository.count({
      where: { toilet: { id: toiletId } },
    });

    return { like: false, count: likes };
  }

  async getLikes(toiletId: number, email: string) {
    const totalLikes = await this.favoriteRepository.count({
      where: { toilet: { id: toiletId } },
    });

    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const hasLiked = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toiletId } },
    });

    return {
      like: !!hasLiked,
      count: totalLikes,
    };
  }

  async addLike(email: string, toiletId: number) {
    const user = await this.userService.findByEmail(email);
    const toilet = await this.toiletRepository.findOne({
      where: { id: toiletId },
    });

    if (!user || !toilet) {
      throw new NotFoundException('유저 또는 화장실 정보를 찾을 수 없습니다.');
    }

    const existingLike = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toilet.id } },
    });

    if (existingLike) {
      throw new ConflictException('이미 좋아요를 추가한 화장실입니다.');
    }

    const newLike = this.favoriteRepository.create({
      user,
      toilet,
    });

    await this.favoriteRepository.save(newLike);

    return await this.favoriteRepository.count({
      where: { toilet: { id: toilet.id } },
    });
  }

  async deleteLike(email: string, toiletId: number) {
    const user = await this.userService.findByEmail(email);
    const toilet = await this.toiletRepository.findOne({
      where: { id: toiletId },
    });

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

    return await this.favoriteRepository.count({
      where: { toilet: { id: toilet.id } },
    });
  }
}
