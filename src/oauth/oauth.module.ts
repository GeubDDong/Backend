import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import oauthConfig from 'src/configs/auth/oauth.config';
import refreshJwtConfig from 'src/configs/auth/refresh.jwt.config';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    ConfigModule.forFeature(oauthConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [OauthController],
  providers: [OauthService, AuthService, UsersService],
})
export class OauthModule {}
