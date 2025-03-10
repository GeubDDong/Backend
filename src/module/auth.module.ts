import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { ConfigModule } from '@nestjs/config';
import kakaoOauthConfig from 'src/configs/auth/kakao.oauth.config';
import { KakaoStrategy } from 'src/strategies/kakao.strategy';
import jwtConfig from 'src/configs/auth/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import refreshJwtConfig from 'src/configs/auth/refresh.jwt.config';
import { UsersService } from 'src/service/users.service';
import { UsersModel } from 'src/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { RefreshJwtStrategy } from 'src/strategies/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(kakaoOauthConfig),
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
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard) applied on all API endppints
    },
  ],
})
export class AuthModule {}
