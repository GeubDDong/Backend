import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 좋아요 조회 (비로그인)
  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  async getLikesPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return await this.likesService.getLikesPublic(toiletId);
  }

  // // 좋아요 조회 (로그인)
  @Get(':toiletId')
  @HttpCode(200)
  async getLikes(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    return await this.likesService.getLikes(toiletId, email);
  }

  // 좋아요 추가
  @Post(':toiletId')
  @HttpCode(201)
  async addLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    return this.likesService.addLike(email, toiletId);
  }

  // 좋아요 삭제
  @Delete(':toiletId')
  @HttpCode(200)
  async deleteLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    return this.likesService.deleteLike(email, toiletId);
  }
}
