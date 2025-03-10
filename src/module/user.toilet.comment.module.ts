import { Module } from '@nestjs/common';
import { UserToiletCommentService } from '../service/user.toilet.comment.service';
import { UserToiletCommentController } from '../controller/user.toilet.comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToiletCommentModel } from 'src/entities/user.toilet.comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToiletCommentModel])],
  controllers: [UserToiletCommentController],
  providers: [UserToiletCommentService],
})
export class UserToiletCommentModule {}
