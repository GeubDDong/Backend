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
import { CommentService } from './comment.service';
import { Public } from 'src/decorator/public.decorator';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  @ApiOperation({ summary: '댓글 조회(비로그인 유저)' })
  async getCommentsPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return this.CommentService.getCommentsPublic(toiletId);
  }

  @Get(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 조회(로그인 유저)' })
  async getComments(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    return this.CommentService.getComments(toiletId, userId);
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
    const userId = Number(req.user.id);
    const { comment } = body;

    await this.CommentService.addComment(toiletId, userId, comment);

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
    const userId = Number(req.user.id);

    const { id: commentId, comment } = body;

    await this.CommentService.updateComment(userId, commentId, comment);

    return { statusCode: 200, message: 'comment updated successfully' };
  }

  @Delete(':toiletId/:commentId')
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
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    const userId = Number(req.user.id);

    await this.CommentService.deleteComment(userId, commentId, toiletId);

    return { statusCode: 200, message: 'comment deleted successfully' };
  }
}
