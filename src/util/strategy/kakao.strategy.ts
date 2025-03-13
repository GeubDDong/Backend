import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import kakaoOauthConfig from '../../configs/auth/kakao.oauth.config';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(kakaoOauthConfig.KEY)
    private readonly kakaoConfiguration: ConfigType<typeof kakaoOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      // POST /oauth/token
      clientID: kakaoConfiguration.clientID,
      clientSecret: kakaoConfiguration.clientSecret,
      callbackURL: kakaoConfiguration.callbackURL,
      scope: ['account_email', 'profile_nickname', 'profile_image'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { _json, id, username, provider } = profile;

    const payload = {
      id,
      username,
      provider,
      email: _json?.kakao_account.email,
      profile_image: _json?.kakao_account.profile.thumbnail_image_url,
    };

    const { user, isNewUser } =
      await this.authService.validateUserByEmail(payload);

    const userWithStatus = { ...user, isNewUser };

    return userWithStatus;
  }
}
