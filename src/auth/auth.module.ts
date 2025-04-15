import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import kakaoOauthConfig from 'src/configs/auth/kakao.oauth.config';
import { KakaoStrategy } from 'src/util/strategy/kakao.strategy';
import jwtConfig from 'src/configs/auth/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import refreshJwtConfig from 'src/configs/auth/refresh.jwt.config';
import { UsersService } from 'src/user/user.service';
import { User } from '../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/util/strategy/jwt.strategy';
import { RefreshJwtStrategy } from 'src/util/strategy/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/util/guards/jwt-auth/jwt-auth.guard';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(kakaoOauthConfig),
    AuthModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    KakaoStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
