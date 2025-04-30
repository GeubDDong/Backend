import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Public } from 'src/decorator/public.decorator';
import { OAuthProvider } from 'src/configs/auth/oauth.provider';
import { Response } from 'express';

@Controller('auth/login')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Public()
  @Post(':provider')
  async socialLogin(
    @Param('provider') provider: OAuthProvider,
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, socialId, isNewUser } =
      await this.oauthService.getOAuthUserByCode(provider, body.code);

    const { accessToken, refreshToken } =
      await this.oauthService.getStoreTokens(socialId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.geubddong.com',
      path: '/',
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.geubddong.com',
      path: '/',
    });

    return {
      statusCode: 200,
      message: 'login successful',
      isNewUser,
      user: {
        user_id: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image: user.profile_image,
        provider: user.provider,
      },
    };
  }
}
