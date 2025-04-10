import {
  Connection,
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Comment } from 'src/entity/comment.entity';
import { Toilet } from 'src/entity/toilet.entity';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>): Promise<void> {
    const commentId = event.entity?.id;
    if (!commentId) return;

    const comment = await event.manager.getRepository(Comment).findOne({
      where: { id: commentId },
      relations: ['toilet'],
    });

    if (comment) {
      const avg =
        (comment.rating_cleanliness +
          comment.rating_amenities +
          comment.rating_accessibility) /
        3;
      const roundedAvg = Math.round(avg * 10) / 10;

      await event.manager.getRepository(Comment).update(comment.id, {
        avg_rating: roundedAvg,
      });

      await this.updateToiletAverages(event.manager, comment.toilet.id);
    }
  }

  async afterUpdate(event: UpdateEvent<Comment>): Promise<void> {
    const commentId = event.entity?.id;
    if (!commentId) return;

    const comment = await event.manager.getRepository(Comment).findOne({
      where: { id: commentId },
      relations: ['toilet'],
    });

    if (comment) {
      const avg =
        (comment.rating_cleanliness +
          comment.rating_amenities +
          comment.rating_accessibility) /
        3;

      const roundedAvg = Math.round(avg * 10) / 10;

      await event.manager.getRepository(Comment).update(comment.id, {
        avg_rating: roundedAvg,
      });

      await this.updateToiletAverages(event.manager, comment.toilet.id);
    }
  }

  async updateToiletAverages(manager: EntityManager, toiletId: number) {
    if (!toiletId) return;

    const comments = await manager.getRepository(Comment).find({
      where: { toilet: { id: toiletId }, is_deleted: false },
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

    let sumClean = 0;
    let sumAmenity = 0;
    let sumAccess = 0;
    for (const c of comments) {
      sumClean += c.rating_cleanliness;
      sumAmenity += c.rating_amenities;
      sumAccess += c.rating_accessibility;
    }

    const count = comments.length;
    const avgClean = sumClean / count;
    const avgAmenity = sumAmenity / count;
    const avgAccess = sumAccess / count;

    const avgCleanRounded = Math.round(avgClean * 10) / 10;
    const avgAmenityRounded = Math.round(avgAmenity * 10) / 10;
    const avgAccessRounded = Math.round(avgAccess * 10) / 10;
    const avgRating =
      Math.round(((avgClean + avgAmenity + avgAccess) / 3) * 10) / 10;

    await manager.getRepository(Toilet).update(toiletId, {
      avg_cleanliness: avgCleanRounded,
      avg_amenities: avgAmenityRounded,
      avg_accessibility: avgAccessRounded,
      avg_rating: avgRating,
    });
  }
}
