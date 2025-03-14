import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToiletModel } from '../entity/toilet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ToiletModel])],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
