import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from 'src/entity/toilet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet])],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
