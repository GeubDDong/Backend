import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { ToiletFacility } from 'src/entity/toilet_facility.entity';
import { Management } from 'src/entity/management.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toilet, ToiletFacility, Management])],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
