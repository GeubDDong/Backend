import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from '../util/types';
import refreshJwtConfig from '../configs/auth/refresh.jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async getStoreTokens(socialId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(socialId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.storeHashedRefreshToken(
      socialId,
      hashedRefreshToken,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(socialId: string) {
    const payload: AuthJwtPayload = { socialId: socialId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserSocialId(user: CreateUserDto) {
    const existUser = await this.usersService.findBySocialId(user.socialId);

    if (existUser) {
      return {
        user: { ...existUser },
        socialId: existUser.social_id,
        isNewUser: false,
      };
    }

    const newUser = await this.usersService.createUser(user);
    return {
      user: { ...newUser },
      socialId: newUser.social_id,
      isNewUser: true,
    };
  }

  async validateUserBySocialId(socialId: string) {
    const user = await this.usersService.getAuthPayloadBySocialId(socialId);
    if (!user) throw new UnauthorizedException('User not found!');

    return {
      socialId: user.social_id,
    };
  }

  async generateAccessToken(socialId: string) {
    const payload: AuthJwtPayload = { socialId: socialId };
    return this.jwtService.signAsync(payload);
  }
  async validateRefreshToken(socialId: string, refreshToken: string) {
    const user = await this.usersService.getAuthPayloadBySocialId(socialId);
    if (!user || !user.refresh_token)
      throw new UnauthorizedException(
        '유저 또는 유저의 리프레시 토큰을 찾을 수 없습니다.',
      );

    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new UnauthorizedException('서로 다른 리프레시 토큰입니다.');

    return { socialId: user.social_id, refresh_token: user.refresh_token };
  }

  async logout(socialId: string) {
    const { statusCode, message } =
      await this.usersService.storeHashedRefreshToken(socialId, null);

    return { statusCode, message };
  }

  async setNickname(socialId: string, nickname: string) {
    const { statusCode, message } = await this.usersService.setNickname(
      socialId,
      nickname,
    );
    return { statusCode, message };
  }
}
