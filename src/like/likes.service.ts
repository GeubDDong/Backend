import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesModel } from 'src/entity/likes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesModel)
    private readonly likesRepository: Repository<LikesModel>,
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

    const user = await this.likesRepository.findOne({
      where: { user: { email: email }, toilet: { id: toiletId } },
    });

    if (!user) {
      return { like: false, count: totalLikes };
    }

    return {
      like: true,
      count: totalLikes,
    };
  }

  async addLike(email: string, toiletId: number) {
    const existingLike = await this.likesRepository.findOne({
      where: { user: { email: email }, toilet: { id: toiletId } },
    });

    if (existingLike) {
      throw new ConflictException('이미 좋아요를 추가한 화장실입니다.');
    }

    const newLike = this.likesRepository.create({
      user: { email: email },
      toilet: { id: toiletId },
    });

    await this.likesRepository.save(newLike);

    return await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });
  }

  async deleteLike(email: string, toiletId: number) {
    const existingLike = await this.likesRepository.findOne({
      where: { user: { email: email }, toilet: { id: toiletId } },
    });

    if (!existingLike) {
      throw new ConflictException(
        '좋아요를 삭제할 화장실이 존재하지 않습니다.',
      );
    }

    await this.likesRepository.delete({
      user: { email: email },
      toilet: { id: toiletId },
    });

    return await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });
  }
}
