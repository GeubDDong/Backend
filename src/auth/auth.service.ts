import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from '../util/types';
import refreshJwtConfig from '../configs/auth/refresh.jwt.config';
import { ConfigService, ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/dto/auth/create.user.dto';
import { UsersService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { lastValueFrom } from 'rxjs';
import { OAuthProvider, OAuthProviders } from 'src/configs/auth/oauth.provider';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
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
    } else {
      const newUser = await this.usersService.createUser(user);
      return {
        user: { ...newUser },
        socialId: newUser.social_id,
        isNewUser: true,
      };
    }
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

  async getOAuthUserByCode(
    provider: OAuthProvider,
    code: string,
  ): Promise<{ user: User; socialId: string; isNewUser: boolean }> {
    try {
      Logger.log(`👉 ${provider} 인증 코드: ${code}`, 'AuthService');

      const { tokenUrl, userInfoUrl, extractProfile } =
        this.getOAuthProviderConfig(provider);

      const { clientID, clientSecret, callbackURL } =
        this.getOAuthCredentials(provider);

      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: callbackURL,
        code,
      });

      const accessToken = await this.requestAccessToken(tokenUrl, tokenParams);
      Logger.log(`✅ ${provider} accessToken 받아옴`, 'AuthService');

      const userData = await this.requestUserInfo(userInfoUrl, accessToken);
      Logger.log(`✅ ${provider} 유저 정보 받아옴`, 'AuthService');

      const { id, email, profile_image } = extractProfile(userData);
      const payload = { socialId: id, provider, email, profile_image };

      Logger.log(
        `📦 payload 구성 완료: ${JSON.stringify(payload)}`,
        'AuthService',
      );

      return this.validateUserSocialId(payload);
    } catch (error) {
      Logger.error(
        `❌ ${provider} 로그인 중 에러 발생: ${error.message}`,
        error.stack,
        'AuthService',
      );
      throw error;
    }
  }

  private getOAuthProviderConfig(provider: OAuthProvider) {
    const config = OAuthProviders[provider];
    if (!config) {
      throw new BadRequestException(
        `지원하지 않는 provider입니다: ${provider}`,
      );
    }
    return config;
  }

  private getOAuthCredentials(provider: OAuthProvider) {
    const config = this.configService.get('oauth');

    const creds = config?.[provider];
    if (!creds) {
      throw new BadRequestException(`잘못된 provider: ${provider}`);
    }

    return {
      clientID: creds.clientID,
      clientSecret: creds.clientSecret,
      callbackURL: creds.callbackURL,
    };
  }

  private async requestAccessToken(tokenUrl: string, params: URLSearchParams) {
    const response = await lastValueFrom(
      this.httpService.post<{ access_token: string }>(tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    return response.data.access_token;
  }

  private async requestUserInfo(userInfoUrl: string, accessToken: string) {
    const response = await lastValueFrom(
      this.httpService.get(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );

    return response.data;
  }
}
