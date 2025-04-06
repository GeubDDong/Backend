import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/cache/redis.service';
import { Comment } from 'src/entity/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly redisService: RedisService,
  ) {}

  async getCommentsPublic(toiletId: number): Promise<any> {
    const cacheKey = `comments:public:${toiletId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    // const comments = await this.commentRepository.find({
    //   where: { toilet: { id: toiletId } },
    //   relations: ['user'],
    // });
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .where('comment.toiletId=:toiletId', { toiletId })
      .select([
        'comment.id',
        'comment.comment',
        'comment.updated_at',
        'user.email',
        'user.nickname',
      ])
      // .orderBy('comment.updated_at', 'DESC') // 필요하시면 넣으세요
      .getMany();

    if (!comments || comments.length === 0) {
      return { statusCode: 200, message: '등록된 댓글이 없습니다.' };
    }

    const result = {
      totalComments: comments.length,
      comments: comments.map((comment) => ({
        id: comment.id,
        user_email: comment.user.email,
        nickname: comment.user.nickname,
        comment: comment.comment,
        updated_at: comment.updated_at,
      })),
    };

    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async getComments(toiletId: number, userId: string): Promise<any> {
    const cacheKey = `comments:user:${userId}:toilet:${toiletId}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .select([
        'comment.id',
        'comment.comment',
        'comment.updated_at',
        'user.email',
        'user.nickname',
        'user.id',
      ])
      .where('comment.toilet_id=:toiletId', { toiletId })
      .getMany();

    if (!comments || comments.length === 0) {
      return { statusCode: 200, message: '등록된 댓글이 없습니다.' };
    }

    const result = {
      totalComments: comments.length,
      comments: comments.map((comment) => ({
        id: comment.id,
        user_email: comment.user.email,
        nickname: comment.user.nickname,
        comment: comment.comment,
        updated_at: comment.updated_at,
        isMine: comment.user.id === Number(userId),
      })),
    };
    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async addComment(
    toiletId: number,
    userId: number,
    comment: string,
  ): Promise<Comment> {
    const newComment = this.commentRepository.create({
      toilet: { id: toiletId },
      user: { id: userId },
      comment: comment,
    });

    const saved = await this.commentRepository.save(newComment);
    return saved;
  }

  async updateComment(
    userId: number,
    commentId: number,
    comment: string,
  ): Promise<Comment> {
    const existingComment = await this.commentRepository.findOne({
      where: { id: commentId, user: { id: userId } },
    });

    if (!existingComment) {
      throw new NotFoundException(`${commentId}번의 댓글을 찾을 수 없습니다.`);
    }

    existingComment.comment = comment;
    const updated = await this.commentRepository.save(existingComment);

    await this.invalidateCommentCache(existingComment.toilet.id, userId);
    return updated;
  }

  async deleteComment(
    userId: number,
    commentId: number,
    toiletId: number,
  ): Promise<void> {
    const existingComment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        user: { id: userId },
        toilet: { id: toiletId },
      },
    });

    if (!existingComment) {
      throw new NotFoundException(`${commentId}번의 댓글을 찾을 수 없습니다.`);
    }

    await this.commentRepository.delete(commentId);
    await this.invalidateCommentCache(toiletId, userId);
  }

  private async invalidateCommentCache(toiletId: number, userId: number) {
    await this.redisService.del(`comments:public:${toiletId}`);
    await this.redisService.del(`comments:user:${userId}:toilet:${toiletId}`);
  }
}
