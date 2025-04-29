import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';
import { ToiletMapRequestPipe } from './pipes/toilet-map-transform.pipe';
import { OptionalJwtAuthGuard } from 'src/util/guards/optional-jwt-auth.guard';

@Controller('toilet')
@UseGuards(OptionalJwtAuthGuard)
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @Public()
  @Get()
  async getToilets(
    @Query(new ToiletMapRequestPipe()) query: any,
    @Req() req: Request,
  ) {
    return await this.toiletService.getToilets(query, req.user?.socialId);
  }
}
