import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToiletCommentModel } from 'src/entity/user.toilet.comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserToiletCommentService {
  constructor(
    @InjectRepository(UserToiletCommentModel)
    private readonly commentRepository: Repository<UserToiletCommentModel>,
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

  async getComments(id: number, userId: string): Promise<any> {
    const comments = await this.commentRepository.find({
      where: { toilet: { id } },
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
        isMine: comment.user.id === userId,
      })),
    };
  }

  async addComment(
    toiletId: number,
    email: string,
    comment: string,
  ): Promise<any> {
    const newComment = this.commentRepository.create({
      toilet: { id: toiletId },
      user: { email: email },
      comment: comment,
    });

    return await this.commentRepository.save(newComment);
  }

  async updateComment(
    email: string,
    id: number,
    comment: string,
  ): Promise<UserToiletCommentModel> {
    const existingComment = await this.commentRepository.findOne({
      where: { id: id, user: { email: email } },
    });

    if (!existingComment) {
      throw new NotFoundException(`{id}번의 댓글을 찾을 수 없습니다.`);
    }

    existingComment.comment = comment;

    return this.commentRepository.save(existingComment);
  }

  async deleteComment(
    email: string,
    commentId: number,
    toiletId: number,
  ): Promise<void> {
    const existingComment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        user: { email: email },
        toilet: { id: toiletId },
      },
    });

    if (!existingComment) {
      throw new NotFoundException(`{commentId}번의 댓글을 찾을 수 없습니다.`);
    }

    await this.commentRepository.delete(existingComment.id);
  }
}
