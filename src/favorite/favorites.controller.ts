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
import { FavoritesService } from './favorites.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '즐겨찾기 조회 (로그인 유저)',
  })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 여부 및 개수 반환',
    schema: {
      example: {
        like: true,
        count: 4,
      },
    },
  })
  async getLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { socialId } = req.user;

    return await this.favoritesService.getLiked(toiletId, socialId);
  }

  @Post(':toiletId')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '즐겨찾기 추가',
  })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 추가 성공',
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
    description: '이미 즐겨찾기한 화장실',
    schema: {
      example: {
        statusCode: 409,
        message: '이미 즐겨찾기를 추가한 화장실입니다.',
      },
    },
  })
  async addLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { socialId } = req.user;

    const result = await this.favoritesService.addLike(socialId, toiletId);

    return {
      statusCode: 201,
      message: 'like created successfully',
      count: result,
    };
  }

  @Delete(':toiletId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: '즐겨찾기 삭제' })
  @ApiParam({ name: 'toiletId', description: '화장실 ID' })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 삭제 성공',
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
    description: '즐겨찾기 삭제 실패',
    schema: {
      example: {
        statusCode: 409,
        message: '즐겨찾기를 해제 할 화장실이 존재하지 않습니다.',
      },
    },
  })
  async deleteLike(
    @Param('toiletId', ParseIntPipe) toiletId: number,
    @Req() req: Request,
  ) {
    const { socialId } = req.user;

    const result = await this.favoritesService.deleteLike(socialId, toiletId);

    return {
      statusCode: 201,
      message: 'like deleted successfully',
      count: result,
    };
  }
}
