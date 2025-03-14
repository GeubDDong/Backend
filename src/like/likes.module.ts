import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikesModel } from 'src/entity/likes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LikesModel])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
