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
import { UserToiletCommentService } from '../service/user.toilet.comment.service';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';

@Controller('comments')
export class UserToiletCommentController {
  constructor(
    private readonly userToiletCommentService: UserToiletCommentService,
  ) {}

  // 댓글 조회 (비로그인)
  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  async getCommentsPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return this.userToiletCommentService.getCommentsPublic(toiletId);
  }

  // 댓글 조회 (로그인)
  @Get(':toiletId')
  @HttpCode(200)
  async getComments(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { id } = req.user;

    return this.userToiletCommentService.getComments(toiletId, id);
  }

  // 댓글 등록
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

    return { message: 'success' };
  }

  // 댓글 수정
  @Put(':toiletId/:commentId')
  @HttpCode(200)
  async updateComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: { comment: string },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { comment } = body;
    return;
    // this.userToiletCommentService.updateComment(
    //   toiletId,
    //   commentId,
    //   email,
    //   comment,
    // );
  }

  // 댓글 삭제

  @Delete(':toiletId/:commentId')
  async deleteComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;
    return;
    // this.userToiletCommentService.deleteComment(
    //   toiletId,
    //   commentId,
    //   email,
    // );
  }
}
