import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MypageRepository } from './mypage.repository';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { Toilet } from 'src/entity/toilet.entity';
import { User } from 'src/entity/user.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { Comment } from 'src/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet, User, Favorite, Comment])],
  controllers: [MypageController],
  providers: [MypageService, MypageRepository],
  exports: [MypageService],
})
export class MypageModule {}
