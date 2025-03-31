import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ToiletDto } from 'src/dto/toilet.dto';

@ApiTags('Toilet')
@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: '회원요청 (비회원 요청일 경우 liked.like:false 유지)',
    type: ToiletDto,
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async getToilets(
    @Query('cenLat') cenLat: number,
    @Query('cenLng') cenLng: number,
    @Query('top') top: number,
    @Query('bottom') bottom: number,
    @Query('left') left: number,
    @Query('right') right: number,
    @Req() req: Request,
  ) {
    const userEmail = req.user?.email ?? undefined;
    return await this.toiletService.getToilets(
      cenLat,
      cenLng,
      top,
      bottom,
      left,
      right,
      userEmail,
    );
  }
}
