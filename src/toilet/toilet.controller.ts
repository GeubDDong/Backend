import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';

@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @Public()
  @Get()
  async getToilets(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Req() req: Request,
  ) {
    const userEmail = req.user?.email ?? undefined;
    return await this.toiletService.getToilets(latitude, longitude, userEmail);
  }
}
