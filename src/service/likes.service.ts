import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesModel } from 'src/entity/likes.entity';
import { UsersModel } from 'src/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesModel)
    private readonly likesRepository: Repository<LikesModel>,
  ) {}

  //좋아요 조회 (비로그인)
  async getLikesPublic(toiletId: number) {
    const likes = await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });

    return { like: false, count: likes };
  }

  //좋아요 조회 (로그인)
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

    return { like: true, count: totalLikes };
  }

  // 좋아요 추가
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

    const totalLikes = await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });

    return { like: true, count: totalLikes, message: '좋아요 추가되었습니다.' };
  }

  // 좋아요 삭제
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

    const totalLikes = await this.likesRepository.count({
      where: { toilet: { id: toiletId } },
    });

    return {
      like: false,
      count: totalLikes,
      message: '좋아요 삭제되었습니다.',
    };
  }
}
