import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';

@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @Public()
  @Get()
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
