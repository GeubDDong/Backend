import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import { CommentsRepository } from './comment.repository';
import { Comment as CommentEntity } from '../entity/comment.entity';
import { UsersRepository } from 'src/user/user.repository';
import { RatingDto } from 'src/dto/comment/create.comment.dto';
import { DetailToiletRepository } from 'src/detailToilet/detail.toilet.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly redisService: RedisService,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly detailToiletRepository: DetailToiletRepository,
  ) {}

  async getCommentsPublic(toiletId: number): Promise<any> {
    const cacheKey = `comments:toilet:${toiletId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const comments =
      await this.commentsRepository.findCommentsByToiletId(toiletId);

    if (!comments.length) {
      const empty = { statusCode: 200, message: '등록된 댓글이 없습니다.' };
      await this.redisService.set(cacheKey, empty, 300);
      return empty;
    }

    const result = {
      comments: comments.map((comment) => ({
        id: comment.id,
        profile_image: comment.user.profile_image,
        avg_rating: comment.avg_rating,
        nickname: comment.user.nickname,
        comment: comment.comment,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
      })),
    };

    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async getComments(toiletId: number, socialId: string): Promise<any> {
    const [user, comments] = await Promise.all([
      this.usersRepository.findBySocialId(socialId),
      this.commentsRepository.findCommentsByToiletId(toiletId),
    ]);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (!comments.length) {
      return { statusCode: 200, message: '등록된 댓글이 없습니다.' };
    }

    const userId = user.id;

    const result = {
      comments: comments.map((comment) => ({
        id: comment.id,
        profile_image: comment.user.profile_image,
        avg_rating: comment.avg_rating,
        accessibility: comment.rating_accessibility,
        amenities: comment.rating_amenities,
        cleanliness: comment.rating_cleanliness,
        nickname: comment.user.nickname,
        comment: comment.comment,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        isMine: comment.user.id === userId,
      })),
    };

    return result;
  }

  async addComment(
    toiletId: number,
    socialId: string,
    comment: string,
    rating: RatingDto,
  ) {
    const user = await this.usersRepository.findBySocialId(socialId);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const userId = user.id;

    await this.commentsRepository.createComment(
      userId,
      toiletId,
      comment,
      rating,
    );

    await this.redisService.del(`comments:toilet:${toiletId}`);
    return this.detailToiletRepository.findRatingList(toiletId);
  }

  async updateComment(
    toiletId: number,
    socialId: string,
    commentId: number,
    comment: string,
    rating: {
      cleanliness: number;
      amenities: number;
      accessibility: number;
    },
  ): Promise<CommentEntity> {
    const user = await this.usersRepository.findBySocialId(socialId);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const userId = user.id;

    const existingComment =
      await this.commentsRepository.findCommentByUsersToiletId(
        toiletId,
        commentId,
        userId,
      );

    if (!existingComment) {
      throw new NotFoundException(`${commentId}번 댓글을 찾을 수 없습니다.`);
    }

    existingComment.comment = comment;
    await this.commentsRepository.updateComment(existingComment, rating);
    await this.redisService.del(`comments:toilet:${toiletId}`);

    return this.detailToiletRepository.findRatingList(toiletId);
  }

  async removeComment(
    social_id: string,
    commentId: number,
    toiletId: number,
  ): Promise<CommentEntity> {
    const user = await this.usersRepository.findBySocialId(social_id);

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const userId = user.id;

    const existingComment =
      await this.commentsRepository.findCommentByUsersToiletId(
        toiletId,
        commentId,
        userId,
      );

    if (!existingComment) {
      throw new NotFoundException(`${commentId}번 댓글을 찾을 수 없습니다.`);
    }

    await this.commentsRepository.removeComment(existingComment);
    await this.redisService.del(`comments:toilet:${toiletId}`);

    return this.detailToiletRepository.findRatingList(toiletId);
  }
}
