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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class UserToiletCommentController {
  constructor(
    private readonly userToiletCommentService: UserToiletCommentService,
  ) {}

  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  @ApiOperation({ summary: '댓글 조회(비로그인 유저)' })
  async getCommentsPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return this.userToiletCommentService.getCommentsPublic(toiletId);
  }

  @Get(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 조회(로그인 유저)' })
  async getComments(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const id = String(req.user.id);

    return this.userToiletCommentService.getComments(toiletId, id);
  }

  @Post(':toiletId')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 추가' })
  @ApiResponse({
    status: 201,
    description: '댓글 작성 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'comment created successfully',
      },
    },
  })
  async addComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() body: { comment: string },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { comment } = body;

    await this.userToiletCommentService.addComment(toiletId, email, comment);

    return { statusCode: 201, message: 'comment created successfully' };
  }

  @Put(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 수정' })
  @ApiResponse({
    status: 200,
    description: '댓글 수정 성공',
    schema: {
      example: {
        statusCode: 200,
        message: 'comment updated successfully',
      },
    },
  })
  async updateComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() body: { id: number; comment: string },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { id, comment } = body;

    await this.userToiletCommentService.updateComment(email, id, comment);

    return { statusCode: 200, message: 'comment updated successfully' };
  }

  @Delete(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiResponse({
    status: 200,
    description: '댓글 삭제 성공',
    schema: {
      example: {
        statusCode: 200,
        message: 'comment deleted successfully',
      },
    },
  })
  async deleteComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() body: { id: number },
    @Req() req: Request,
  ) {
    const { email } = req.user;
    const { id } = body;

    await this.userToiletCommentService.deleteComment(email, id, toiletId);

    return { statusCode: 200, message: 'comment deleted successfully' };
  }
}
