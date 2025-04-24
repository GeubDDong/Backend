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
import { OauthModule } from './oauth/oauth.module';
import { MypageController } from './mypage/mypage.controller';
import { MypageService } from './mypage/mypage.service';
import { MypageModule } from './mypage/mypage.module';
import { JwtStrategy } from './util/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './configs/auth/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    DetailToiletModule,
    FavoritesModule,
    AuthModule,
    CommentModule,
    UsersModule,
    ExcelModule,
    ToiletModule,
    OauthModule,
    MypageModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
