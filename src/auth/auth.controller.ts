import {
  Body,
  Controller,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('refresh-jwt'))
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const socialId = req.user.socialId;

    const accessToken = await this.authService.generateAccessToken(socialId);
    const refreshToken = await this.authService.generateRefreshToken(socialId);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.geubddong.com',
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.geubddong.com',
      path: '/',
    });

    return {
      statusCode: 201,
      message: 'access token refreshed successfully',
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const socialId = req.user.socialId;

    const { statusCode, message } = await this.authService.logout(socialId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.geubddong.com',
      path: '/',
    });
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.geubddong.com',
      path: '/',
    });

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
