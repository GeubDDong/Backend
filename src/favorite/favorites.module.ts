import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { FavoriteRepository } from './favorites.repository';
import { UsersRepository } from 'src/user/user.repository';
import { ToiletRepository } from 'src/toilet/toilet.repository';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Toilet, User])],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    FavoriteRepository,
    UsersRepository,
    ToiletRepository,
  ],
  exports: [FavoriteRepository, FavoritesService],
})
export class FavoritesModule {}
