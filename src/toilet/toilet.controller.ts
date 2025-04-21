import { Controller, Get, Query, Req } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ToiletRequestDto } from 'src/dto/toilet/request/toilet-request.dto';

@ApiTags('Toilet')
@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @Public()
  @Get()
  async getToilets(@Query() query: ToiletRequestDto, @Req() req: Request) {
    const {
      cenLat,
      cenLng,
      top,
      bottom,
      left,
      right,
      has_male_toilet,
      has_female_toilet,
      has_disabled_male_toilet,
      has_disabled_female_toilet,
      has_kids_toilet,
      has_cctv,
      has_emergency_bell,
      has_diaper_changing_station,
    } = query;
    const userSocialId = req.user?.socialId ?? undefined;

    return await this.toiletService.getToilets(
      cenLat,
      cenLng,
      top,
      bottom,
      left,
      right,
      userSocialId,
      {
        has_male_toilet,
        has_female_toilet,
        has_disabled_male_toilet,
        has_disabled_female_toilet,
        has_kids_toilet,
        has_cctv,
        has_emergency_bell,
        has_diaper_changing_station,
      },
    );
  }
}
