import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { DataSource, Repository } from 'typeorm';
import { CommentSubscriber } from './comment.subscriber';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly commentSubscriber: CommentSubscriber,
    private readonly dataSource: DataSource,
  ) {}

  async findCommentsPublic(toiletId: number): Promise<any> {
    const comments = await this.commentRepository.find({
      where: { toilet: { id: toiletId }, is_deleted: false },
      relations: ['user'],
    });

    return comments;
  }

  async findCommentsBySocialId(toiletId: number, socialId: string) {
    const comments = await this.commentRepository.find({
      where: {
        toilet: { id: toiletId },
        user: { social_id: socialId },
        is_deleted: false,
      },
      relations: ['user'],
    });

    return comments;
  }

  async createComment(userId, toiletId, comment, rating) {
    const newComment = this.commentRepository.create({
      user: { id: userId },
      toilet: { id: toiletId },
      comment: comment,
      rating_cleanliness: rating.cleanliness,
      rating_amenities: rating.amenities,
      rating_accessibility: rating.accessibility,
    });

    return await this.commentRepository.save(newComment);
  }

  async findCommentByUsersToiletId(toiletId, commentId, userId) {
    const existingComment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        user: { id: userId },
        toilet: { id: toiletId },
      },
      relations: ['user', 'toilet'],
    });

    return existingComment;
  }

  async updateComment(
    comment: Comment,
    rating: {
      cleanliness: number;
      amenities: number;
      accessibility: number;
    },
  ): Promise<Comment> {
    comment.comment = comment.comment;
    comment.rating_cleanliness = rating.cleanliness;
    comment.rating_amenities = rating.amenities;
    comment.rating_accessibility = rating.accessibility;

    return await this.commentRepository.save(comment);
  }

  async removeComment(existingComment: Comment): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: existingComment.id },
      relations: ['toilet'],
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.is_deleted = true;
    const savedComment = await this.commentRepository.save(comment);

    await this.commentSubscriber.updateToiletAverages(
      this.dataSource.manager, // Comment Entity
      comment.toilet.id,
    );

    return savedComment;
  }
}
