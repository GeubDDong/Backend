import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToiletModel } from '../entity/toilet.entity';
import { LikesModel } from 'src/entity/likes.entity';
import { ToiletController } from './toilet.controller';
import { ToiletService } from './toilet.service';
import { ToiletRepository } from './toilet.repository';
import { LikesService } from 'src/like/likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ToiletModel, LikesModel])],
  controllers: [ToiletController],
  providers: [ToiletService, ToiletRepository, LikesService],
})
export class ToiletModule {}
