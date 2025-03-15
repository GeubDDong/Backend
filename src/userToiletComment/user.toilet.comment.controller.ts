import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserToiletCommentService } from './user.toilet.comment.service';
import { Public } from 'src/decorator/public.decorator';
import { Request } from 'express';

@Controller('comments')
export class UserToiletCommentController {
  constructor(
    private readonly userToiletCommentService: UserToiletCommentService,
  ) {}

  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  async getCommentsPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return this.userToiletCommentService.getCommentsPublic(toiletId);
  }

  @Get(':toiletId')
  @HttpCode(200)
  async getComments(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const id = String(req.user.id);

    return this.userToiletCommentService.getComments(toiletId, id);
  }

  @Post(':toiletId')
  @HttpCode(201)
  async addComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() body: { comment: string },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { comment } = body;

    await this.userToiletCommentService.addComment(toiletId, email, comment);

    return { statusCode: 201, message: 'success' };
  }

  @Put(':toiletId')
  @HttpCode(200)
  async updateComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() body: { id: number; comment: string },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { id, comment } = body;

    await this.userToiletCommentService.updateComment(email, id, comment);

    return { statusCode: 200, message: 'success' };
  }

  @Delete(':toiletId')
  @HttpCode(200)
  async deleteComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() body: { id: number },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { id } = body;

    await this.userToiletCommentService.deleteComment(email, id, toiletId);

    return { statusbar: 200, message: 'success' };
  }
}
