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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Public()
  @Get(':toiletId/public')
  @HttpCode(200)
  @ApiOperation({
    summary: '좋아요 조회 (비로그인 유저)',
  })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 200,
    description: '좋아요 개수 반환',
    schema: {
      example: {
        like: false,
        count: 4,
      },
    },
  })
  async getLikesPublic(@Param('toiletId', ParseIntPipe) toiletId: number) {
    return await this.likesService.getLikesPublic(toiletId);
  }

  @Get(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '좋아요 조회 (로그인 유저)',
  })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 200,
    description: '좋아요 여부 및 개수 반환',
    schema: {
      example: {
        like: true,
        count: 4,
      },
    },
  })
  async getLikes(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { email } = req.user;

    return await this.likesService.getLikes(toiletId, email);
  }

  @Post(':toiletId')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '좋아요 추가',
  })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 201,
    description: '좋아요 추가 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'like created successfully',
        count: 5,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '이미 좋아요한 화장실',
    schema: {
      example: {
        statusCode: 409,
        message: '이미 좋아요를 추가한 화장실입니다.',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: '좋아요 삭제' })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 201,
    description: '좋아요 삭제 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'like deleted successfully',
        count: 3,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '좋아요 삭제 실패',
    schema: {
      example: {
        statusCode: 409,
        message: '좋아요를 삭제 할 화장실이 존재하지 않습니다.',
      },
    },
  })
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
