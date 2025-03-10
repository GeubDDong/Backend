import { Module } from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { LikesController } from '../controller/likes.controller';
import { LikesModel } from 'src/entities/likes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LikesModel])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
