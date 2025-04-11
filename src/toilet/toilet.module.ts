import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from '../entity/toilet.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { ToiletController } from './toilet.controller';
import { ToiletService } from './toilet.service';
import { ToiletRepository } from './toilet.repository';
import { LikesService } from 'src/like/likes.service';
import { RedisModule } from 'src/cache/redis.module';
import { UsersModule } from 'src/user/user.module';
import { LikesModule } from 'src/like/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Toilet, Favorite]),
    RedisModule,
    UsersModule,
    LikesModule,
  ],
  controllers: [ToiletController],
  providers: [ToiletService, ToiletRepository, LikesService],
  exports: [ToiletRepository],
})
export class ToiletModule {}
