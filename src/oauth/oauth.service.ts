import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { OAuthProvider, OAuthProviders } from 'src/configs/auth/oauth.provider';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class OauthService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  // move
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

      return this.authService.validateUserSocialId(payload);
    } catch (error) {
      Logger.error(
        `❌ ${provider} 로그인 중 에러 발생: ${error.message}`,
        error.stack,
        'AuthService',
      );
      throw error;
    }
  }

  // move
  private getOAuthProviderConfig(provider: OAuthProvider) {
    const config = OAuthProviders[provider];
    if (!config) {
      throw new BadRequestException(
        `지원하지 않는 provider입니다: ${provider}`,
      );
    }
    return config;
  }

  // move
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

  // move
  private async requestAccessToken(tokenUrl: string, params: URLSearchParams) {
    const response = await lastValueFrom(
      this.httpService.post<{ access_token: string }>(tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    return response.data.access_token;
  }

  // move
  private async requestUserInfo(userInfoUrl: string, accessToken: string) {
    const response = await lastValueFrom(
      this.httpService.get(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );

    return response.data;
  }

  async getStoreTokens(socialId: string) {
    return await this.authService.getStoreTokens(socialId);
  }
}
