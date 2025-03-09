import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { ToiletUploadService } from './service/toilet-upload.service';
import { ToiletUploadController } from './controller/toilet-upload.controller';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig)],
  providers: [ToiletUploadService],
  controllers: [ToiletUploadController],
})
export class AppModule {}
