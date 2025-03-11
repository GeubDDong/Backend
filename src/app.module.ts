import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { ToiletUploadService } from './service/toilet-upload.service';
import { ToiletUploadController } from './controller/toilet-upload.controller';
import { RedisModule } from './configs/redis.module';
import { RedisService } from './service/redis.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), RedisModule],
  providers: [ToiletUploadService, RedisService],
  controllers: [ToiletUploadController],
})
export class AppModule {}
