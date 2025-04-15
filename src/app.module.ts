import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { DetailToiletModule } from './detailToilet/detail.toilet.module';
import { FavoritesModule } from './favorite/favorites.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { UsersModule } from './user/user.module';
import { ExcelModule } from './excel/excel.module';
import { ToiletModule } from './toilet/toilet.module';
import { Favorite } from './entity/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    DetailToiletModule,
    FavoritesModule,
    AuthModule,
    CommentModule,
    UsersModule,
    ExcelModule,
    ToiletModule,
  ],
})
export class AppModule {}
