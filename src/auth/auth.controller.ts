import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Public } from 'src/decorator/public.decorator';
import { SetNicknameDto } from 'src/dto/auth/set.nickname.dto';
import { OAuthProvider } from 'src/configs/auth/oauth.provider';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/:provider')
  async socialLogin(
    @Param('provider') provider: OAuthProvider,
    @Body() body: { code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, socialId, isNewUser } =
      await this.authService.getOAuthUserByCode(provider, body.code);

    const { accessToken, refreshToken } =
      await this.authService.getStoreTokens(socialId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
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

  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('refresh-jwt'))
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const socialId = req.user.socialId;

    const accessToken = await this.authService.generateAccessToken(socialId);

    return {
      statusCode: 201,
      message: 'access token refreshed successfully',
      accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const socialId = req.user.socialId;

    const { statusCode, message } = await this.authService.logout(socialId);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return { statusCode, message };
  }

  @Post('nickname')
  @UsePipes(new ValidationPipe({ transform: true }))
  async setNickname(
    @Req() req: Request,
    @Body() setNicknameDto: SetNicknameDto,
  ) {
    const socialId = req.user.socialId;
    const { nickname } = setNicknameDto;

    const { statusCode, message } = await this.authService.setNickname(
      socialId,
      nickname,
    );
    return { statusCode, message };
  }
}
