import { Module } from '@nestjs/common';
import { DetailToiletService } from '../service/detail.toilet.service';
import { DetailToiletController } from '../controller/detail.toilet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToiletModel } from 'src/entities/toilet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ToiletModel])],
  controllers: [DetailToiletController],
  providers: [DetailToiletService],
})
export class DetailToiletModule {}
