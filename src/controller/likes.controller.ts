import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('like')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 좋아요 조회 (비로그인)
  @Public()
  @Get(':toiletId/public')
  async getLikesPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return;
  }

  // 좋아요 조회 (로그인)
  @Get(':toiletId')
  async getLikes(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return;
  }

  // 좋아요 추가
  @Post(':toiletId')
  async addLike(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return;
  }

  // 좋아요 삭제
  @Delete(':toiletId')
  async deleteLike(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return;
  }
}
