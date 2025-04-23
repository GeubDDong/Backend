import { Module } from '@nestjs/common';
import { MypageController } from './mypage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsRepository } from 'src/comment/comment.repository';
import { Toilet } from 'src/entity/toilet.entity';
import { User } from 'src/entity/user.entity';
import { Comment } from 'src/entity/comment.entity';
import { ToiletRepository } from 'src/toilet/toilet.repository';
import { MypageService } from './mypage.service';
import { MypageRepository } from './mypage.repository';
import { CommentSubscriber } from 'src/comment/comment.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet, User, Comment])],
  controllers: [MypageController],
  providers: [
    MypageService,
    MypageRepository,
    ToiletRepository,
    CommentsRepository,
    CommentSubscriber,
  ],
  exports: [MypageRepository],
})
export class MypageModule {}
