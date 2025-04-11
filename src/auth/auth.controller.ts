import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CookieOptions, Request, Response } from 'express';
import { Public } from 'src/decorator/public.decorator';
import { SetNicknameDto } from 'src/dto/auth/set.nickname.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Get('kakaoLogin')
  @Header('Content-Type', 'text/html')
  getKakaoLoginPage(): string {
    return `
    <div>
        <h1>카카오 로그인</h1>

        <form action="/auth/login/kakao" method="GET">
            <input type="submit" value="카카오로그인" />
        </form>

        <form action="/auth/logout" method="POST">
            <input type="submit" value="카카오로그아웃 및 연결 끊기" />
        </form>
    </div>
    `;
  }
  @Public()
  @UseGuards(AuthGuard('kakao'))
  @Get('login/:provider')
  checkProvider() {}

  @Public()
  @Get('kakao-callback')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(302)
  async kakaoLogin(
    @Req()
    req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const socialId = req.user.socialId;

    const { accessToken, refreshToken } =
      await this.authService.getStoreTokens(socialId);

    const cookieOptions: CookieOptions = { httpOnly: true, secure: true };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // if (user.isNewUser) {
    //   return res.redirect(
    //     `https://geubddong-deploy.vercel.app/auth/callback?accessToken=${accessToken}&flag=newUser`,
    //   );
    // }

    // return res.redirect(
    //   `https://geubddong-deploy.vercel.app/auth/callback?accessToken=${accessToken}`,
    // );

    return {
      statusCode: 200,
      message: 'login successful',
      accessToken,
      refreshToken,
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
