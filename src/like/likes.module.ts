import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Favorite } from 'src/entity/favorite.entity';
import { Toilet } from 'src/entity/toilet.entity';
import { LikesRepository } from './likes.repository';
import { UsersRepository } from 'src/user/user.repository';
import { ToiletRepository } from 'src/toilet/toilet.repository';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Toilet, User])],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository, UsersRepository, ToiletRepository],
  exports: [LikesRepository],
})
export class LikesModule {}
