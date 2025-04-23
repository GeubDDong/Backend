import {
  Connection,
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>): Promise<void> {
    await this.handleCommentChange(event.manager, event.entity?.id);
  }

  async afterUpdate(event: UpdateEvent<Comment>): Promise<void> {
    await this.handleCommentChange(event.manager, event.entity?.id);
  }

  private async handleCommentChange(
    manager: EntityManager,
    commentId?: number,
  ) {
    if (!commentId) return;

    const comment = await manager.getRepository(Comment).findOne({
      where: { id: commentId },
      relations: ['toilet'],
    });

    if (!comment) return;

    const avgRating = this.calculateAvgRating(comment);
    await manager.getRepository(Comment).update(comment.id, {
      avg_rating: avgRating,
    });

    await this.updateToiletAverages(manager, comment.toilet.id);
  }

  private calculateAvgRating(comment: Comment): number {
    const { rating_cleanliness, rating_amenities, rating_accessibility } =
      comment;
    const avg =
      (rating_cleanliness + rating_amenities + rating_accessibility) / 3;
    return Math.round(avg * 10) / 10;
  }

  async updateToiletAverages(manager: EntityManager, toiletId: number) {
    const comments = await manager.getRepository(Comment).find({
      where: { toilet: { id: toiletId }, deleted: false },
    });

    if (comments.length === 0) {
      await manager.getRepository(Toilet).update(toiletId, {
        avg_cleanliness: 0,
        avg_amenities: 0,
        avg_accessibility: 0,
        avg_rating: 0,
      });
      return;
    }

    const sum = comments.reduce(
      (acc, c) => {
        acc.clean += c.rating_cleanliness;
        acc.amenity += c.rating_amenities;
        acc.access += c.rating_accessibility;
        return acc;
      },
      { clean: 0, amenity: 0, access: 0 },
    );

    const count = comments.length;
    const avgClean = Math.round((sum.clean / count) * 10) / 10;
    const avgAmenity = Math.round((sum.amenity / count) * 10) / 10;
    const avgAccess = Math.round((sum.access / count) * 10) / 10;
    const avgTotal =
      Math.round(((avgClean + avgAmenity + avgAccess) / 3) * 10) / 10;

    await manager.getRepository(Toilet).update(toiletId, {
      avg_cleanliness: avgClean,
      avg_amenities: avgAmenity,
      avg_accessibility: avgAccess,
      avg_rating: avgTotal,
    });
  }
}
