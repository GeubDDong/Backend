import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToiletCommentModel } from 'src/entities/user.toilet.comment.entity';
import { UsersModel } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserToiletCommentService {
  constructor(
    @InjectRepository(UserToiletCommentModel)
    private readonly commentRepository: Repository<UserToiletCommentModel>,

    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  // 댓글 조회 (비로그인)
  async getCommentsPublic(toiletId: number): Promise<{ comments: any }> {
    const comments = await this.commentRepository.find({
      where: { toilet: { id: toiletId } },
      relations: ['user'],
    });

    if (!comments || comments.length === 0) {
      throw new NotFoundException(`No comments found for toiletId ${toiletId}`);
    }

    return {
      comments: comments.map((comment) => ({
        id: comment.id,
        user_email: comment.user.email,
        nickname: comment.user.nickname,
        comment: comment.comment,
        updated_at: comment.updated_at,
      })),
    };
  }

  // 댓글 조회 (로그인)
  async getComments(id: number, userId: number): Promise<{ comments: any }> {
    const comments = await this.commentRepository.find({
      where: { toilet: { id } },
      relations: ['user'],
    });

    return {
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
  // 댓글 등록
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
}

// 댓글 수정
//   async updateComment() //     id: number,
//     commentId: number,
//     email: string,
//     comment: string,
//   : Promise<UserToiletCommentModel> {
// const comment = await this.commentRepository.findOne(commentId);
// comment.comment = 'updated comment';
// return this.commentRepository.save(comment);
// }

// 댓글 삭제
//   async deleteComment(
//     id: number,
//     commentId: number,
//     email: string,
//   ): Promise<void> {
//     await this.commentRepository.delete({ id: commentId });
//   }
// }
