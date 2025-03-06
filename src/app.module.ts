import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { DetailToiletModule } from './module/detail.toilet.module';
import { LikesModule } from './module/likes.module';
import { AuthModule } from './module/auth.module';
import { UserToiletCommentModule } from './module/user.toilet.comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    DetailToiletModule,
    LikesModule,
    AuthModule,
    UserToiletCommentModule,
  ],
})
export class AppModule {}
