import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { DetailToiletModule } from './detailToilet/detail.toilet.module';
import { LikesModule } from './like/likes.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { UsersModule } from './user/user.module';
import { ExcelModule } from './excel/excel.module';
import { ToiletModule } from './toilet/toilet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    DetailToiletModule,
    LikesModule,
    AuthModule,
    CommentModule,
    UsersModule,
    ExcelModule,
    ToiletModule,
  ],
})
export class AppModule {}
