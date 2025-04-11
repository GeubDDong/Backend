import { Module } from '@nestjs/common';
import { DetailToiletService } from './detail.toilet.service';
import { DetailToiletController } from './detail.toilet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { DetailToiletRepository } from './detail.toilet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet])],
  controllers: [DetailToiletController],
  providers: [DetailToiletService, DetailToiletRepository],
})
export class DetailToiletModule {}
