import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getCommentsPublic(toiletId: number): Promise<any> {
    const comments = await this.commentRepository.find({
      where: { toilet: { id: toiletId } },
      relations: ['user'],
    });

    if (!comments || comments.length === 0) {
      return { statusCode: 200, message: '등록된 댓글이 없습니다.' };
    }

    return {
      totalComments: comments.length,
      comments: comments.map((comment) => ({
        id: comment.id,
        user_email: comment.user.email,
        nickname: comment.user.nickname,
        comment: comment.comment,
        updated_at: comment.updated_at,
      })),
    };
  }

  async getComments(toiletId: number, userId: string): Promise<any> {
    const comments = await this.commentRepository.find({
      where: { toilet: { id: toiletId } },
      relations: ['user'],
    });

    if (!comments || comments.length === 0) {
      return { statusCode: 200, message: '등록된 댓글이 없습니다.' };
    }

    return {
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

    return await this.commentRepository.save(newComment);
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
      throw new NotFoundException(`{commentId}번의 댓글을 찾을 수 없습니다.`);
    }

    existingComment.comment = comment;

    return this.commentRepository.save(existingComment);
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
      throw new NotFoundException(`{commentId}번의 댓글을 찾을 수 없습니다.`);
    }

    await this.commentRepository.delete(commentId);
  }
}
