import { Controller, Get, Query, Req } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { ToiletMapRequestDto } from 'src/dto/toilet/request/toilet-request.dto';
import { Request } from 'express';
import { ToiletMapRequestPipe } from './pipes/toilet-map-transform.pipe';

@Controller('toilet')
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
