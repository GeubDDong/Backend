import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToiletModel } from '../entity/toilet.entity';
import { LikesModel } from 'src/entity/likes.entity';
import { ToiletController } from './toilet.controller';
import { ToiletService } from './toilet.service';
import { ToiletRepository } from './toilet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ToiletModel, LikesModel])],
  controllers: [ToiletController],
  providers: [ToiletService, ToiletRepository],
})
export class ToiletModule {}
