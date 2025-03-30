import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from '../entity/toilet.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { ToiletController } from './toilet.controller';
import { ToiletService } from './toilet.service';
import { ToiletRepository } from './toilet.repository';
import { LikesService } from 'src/like/likes.service';
import { RedisModule } from 'src/cache/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet, Favorite]), RedisModule],
  controllers: [ToiletController],
  providers: [ToiletService, ToiletRepository, LikesService],
})
export class ToiletModule {}
