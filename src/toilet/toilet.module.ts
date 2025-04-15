import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from '../entity/toilet.entity';
import { Favorite } from 'src/entity/favorite.entity';
import { ToiletController } from './toilet.controller';
import { ToiletService } from './toilet.service';
import { ToiletRepository } from './toilet.repository';
import { FavoritesService } from 'src/favorite/favorites.service';
import { RedisModule } from 'src/cache/redis.module';
import { UsersModule } from 'src/user/user.module';
import { FavoritesModule } from 'src/favorite/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Toilet, Favorite]),
    RedisModule,
    UsersModule,
    FavoritesModule,
  ],
  controllers: [ToiletController],
  providers: [ToiletService, ToiletRepository, FavoritesService],
  exports: [ToiletRepository],
})
export class ToiletModule {}
