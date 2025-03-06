import { Module } from '@nestjs/common';
import { UserToiletCommentService } from '../service/user.toilet.comment.service';
import { UserToiletCommentController } from '../controller/user.toilet.comment.controller';

@Module({
  controllers: [UserToiletCommentController],
  providers: [UserToiletCommentService],
})
export class UserToiletCommentModule {}
