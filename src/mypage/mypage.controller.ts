import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MypageService } from './mypage.service';
import { JwtAuthGuard } from 'src/util/guards/jwt-auth/jwt-auth.guard';
import { MyPageResponseDto } from 'src/dto/mypage/response/mypage-response.dto';
import { Request } from 'express';

@ApiTags('MyPage')
@Controller('mypage')
export class MypageController {
  constructor(private readonly myPageService: MypageService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, type: MyPageResponseDto })
  getMyPage(@Req() req: Request): Promise<MyPageResponseDto> {
    return this.myPageService.getMyPage(req.user.socialId);
  }
}
