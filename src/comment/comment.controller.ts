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
import { CreateCommentDto } from 'src/dto/comment/create.comment.dto';
import { UpdateCommentDto } from 'src/dto/comment/update.comment.dto';

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
    const { socialId } = req.user;
    return this.CommentService.getComments(toiletId, socialId);
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
        data: {
          avg_rating: 4.3,
          avg_cleanliness: 4.5,
          avg_amenities: 4.0,
          avg_accessibility: 4.5,
        },
      },
    },
  })
  async addComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const { socialId } = req.user;
    const { comment, rating } = createCommentDto;

    const ratingList = await this.CommentService.addComment(
      toiletId,
      socialId,
      comment,
      rating,
    );

    return {
      statusCode: 201,
      message: 'comment created successfully',
      data: ratingList,
    };
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
        data: {
          avg_rating: 4.3,
          avg_cleanliness: 4.5,
          avg_amenities: 4.0,
          avg_accessibility: 4.5,
        },
      },
    },
  })
  async updateComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const { socialId } = req.user;

    const { commentId, comment, rating } = updateCommentDto;

    const ratingList = await this.CommentService.updateComment(
      toiletId,
      socialId,
      commentId,
      comment,
      rating,
    );

    return {
      statusCode: 200,
      message: 'comment updated successfully',
      data: ratingList,
    };
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
        data: {
          avg_rating: 4.3,
          avg_cleanliness: 4.5,
          avg_amenities: 4.0,
          avg_accessibility: 4.5,
        },
      },
    },
  })
  async removeComment(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Body('commentId') commentId: number,
    @Req() req: Request,
  ) {
    const { socialId } = req.user;

    const ratingList = await this.CommentService.removeComment(
      socialId,
      commentId,
      toiletId,
    );

    return {
      statusCode: 201,
      message: 'comment removed successfully',
      data: ratingList,
    };
  }
}
