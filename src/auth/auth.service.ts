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

  async getStoreTokens(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: String(userId) };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserByEmail(user: CreateUserDto) {
    const existUser = await this.usersService.findByEmail(user.email);
    if (existUser) return { user: existUser, isNewUser: false };

    const newUser = await this.usersService.create(user);
    return { user: newUser, isNewUser: true };
  }

  async validateUserById(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return user;
  }

  async generateAccessToken(userId: number) {
    const payload: AuthJwtPayload = { sub: String(userId) };
    return this.jwtService.signAsync(payload);
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
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

    return { id: user.id, refresh_token: user.refresh_token };
  }

  async logout(userId: number) {
    const { statusCode, message } =
      await this.usersService.updateHashedRefreshToken(userId, undefined);

    return { statusCode, message };
  }

  async setNickname(userId: number, nickname: string) {
    const { statusCode, message } = await this.usersService.updateNickname(
      userId,
      nickname,
    );
    return { statusCode, message };
  }
}
