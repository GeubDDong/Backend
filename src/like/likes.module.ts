import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { UsersModule } from 'src/user/user.module'; // ✅ 이거 추가

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Toilet]), UsersModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
