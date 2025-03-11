import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { DetailToiletModule } from './module/detail.toilet.module';
import { LikesModule } from './module/likes.module';
import { AuthModule } from './module/auth.module';
import { UserToiletCommentModule } from './module/user.toilet.comment.module';
import { UsersModule } from './module/users.module';
import { ToiletUploadService } from './service/toilet-upload.service';
import { ToiletUploadController } from './controller/toilet-upload.controller';
import { RedisModule } from './configs/redis.module';
import { RedisService } from './service/redis.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    DetailToiletModule,
    LikesModule,
    AuthModule,
    UserToiletCommentModule,
    UsersModule,
  ],
})
export class AppModule {}
