import { Module } from '@nestjs/common';
import { DetailToiletService } from './detail.toilet.service';
import { DetailToiletController } from './detail.toilet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToiletModel } from 'src/entity/toilet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ToiletModel])],
  controllers: [DetailToiletController],
  providers: [DetailToiletService],
})
export class DetailToiletModule {}
