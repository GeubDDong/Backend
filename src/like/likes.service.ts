import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly likesRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async getLikesPublic(toiletId: number) {
    const likes = await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });

    return { like: false, count: likes };
  }

  async getLikes(toiletId: number, email: string) {
    const totalLikes = await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const hasLiked = await this.likesRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toiletId } },
    });

    return {
      like: !!hasLiked,
      count: totalLikes,
    };
  }

  async addLike(email: string, toiletId: number) {
    const user = await this.userRepository.findOne({ where: { email } });
    const toilet = await this.toiletRepository.findOne({
      where: { id: toiletId },
    });

    if (!user || !toilet) {
      throw new NotFoundException('유저 또는 화장실 정보를 찾을 수 없습니다.');
    }

    const existingLike = await this.likesRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toilet.id } },
    });

    if (existingLike) {
      throw new ConflictException('이미 좋아요를 추가한 화장실입니다.');
    }

    const newLike = this.likesRepository.create({
      user,
      toilet,
    });

    await this.likesRepository.save(newLike);

    return await this.likesRepository.count({
      where: { toilet: { id: toilet.id } },
    });
  }

  async deleteLike(email: string, toiletId: number) {
    const user = await this.userRepository.findOne({ where: { email } });
    const toilet = await this.toiletRepository.findOne({
      where: { id: toiletId },
    });

    if (!user || !toilet) {
      throw new NotFoundException('유저 또는 화장실 정보를 찾을 수 없습니다.');
    }

    const existingLike = await this.likesRepository.findOne({
      where: { user: { id: user.id }, toilet: { id: toilet.id } },
    });

    if (!existingLike) {
      throw new ConflictException(
        '좋아요를 삭제할 화장실이 존재하지 않습니다.',
      );
    }

    await this.likesRepository.remove(existingLike);

    return await this.likesRepository.count({
      where: { toilet: { id: toilet.id } },
    });
  }
}
