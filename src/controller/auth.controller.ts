import {
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

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
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    const { accessToken, refreshToken } = await this.authService.getStoreTokens(
      user.id,
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

    return res.status(user.isNewUser ? 201 : 200).json({
      message: 'success',
      accessToken,
      statusCode: user.isNewUser ? 201 : 200,
    });
  }

  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('refresh-jwt'))
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.id;
    console.log('userId', userId);
    const accessToken = await this.authService.generateAccessToken(userId);

    return res.json({ statusCode: 201, message: 'success', accessToken });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    return res.json({ statusCode: 201, message: 'Logout successful' });
  }

  @Post('nickname')
  async setNickname(@Req() req: Request, @Res() res: Response) {
    const { nickname } = req.body;
    const userId = req.user.id;

    const { statusCode, message } = await this.authService.setNickname(
      userId,
      nickname,
    );
    return res.json({ statusCode, message });
  }
}
