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
import { LikesService } from './likes.service';
import { Public } from 'src/decorator/public.decorator';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  async getLikesPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return await this.likesService.getLikesPublic(toiletId);
  }

  @Get(':toiletId')
  @HttpCode(200)
  async getLikes(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    return await this.likesService.getLikes(toiletId, email);
  }

  @Post(':toiletId')
  @HttpCode(201)
  async addLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    const result = await this.likesService.addLike(email, toiletId);

    return {
      statusCode: 201,
      message: 'like created successfully',
      count: result,
    };
  }

  @Delete(':toiletId')
  @HttpCode(200)
  async deleteLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    const result = await this.likesService.deleteLike(email, toiletId);

    return {
      statusCode: 201,
      message: 'like deleted successfully',
      count: result,
    };
  }
}
