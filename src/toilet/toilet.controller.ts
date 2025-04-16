import { Controller, Get, Query, Req } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Toilet')
@Controller('toilet')
export class ToiletController {
  constructor(private readonly toiletService: ToiletService) {}

  @Public()
  @Get()
  @ApiQuery({ name: 'cenLat', required: true, type: Number })
  @ApiQuery({ name: 'cenLng', required: true, type: Number })
  @ApiQuery({ name: 'top', required: true, type: Number })
  @ApiQuery({ name: 'bottom', required: true, type: Number })
  @ApiQuery({ name: 'left', required: true, type: Number })
  @ApiQuery({ name: 'right', required: true, type: Number })
  @ApiQuery({ name: 'has_male_toilet', required: false, type: Boolean })
  @ApiQuery({ name: 'has_female_toilet', required: false, type: Boolean })
  @ApiQuery({ name: 'has_disabled_toilet', required: false, type: Boolean })
  @ApiQuery({ name: 'has_kids_toilet', required: false, type: Boolean })
  @ApiQuery({ name: 'has_cctv', required: false, type: Boolean })
  @ApiQuery({ name: 'has_emergency_bell', required: false, type: Boolean })
  @ApiQuery({
    name: 'has_diaper_changing_station',
    required: false,
    type: Boolean,
  })
  async getToilets(
    @Query('cenLat') cenLat: number,
    @Query('cenLng') cenLng: number,
    @Query('top') top: number,
    @Query('bottom') bottom: number,
    @Query('left') left: number,
    @Query('right') right: number,
    @Req() req: Request,
    @Query('has_male_toilet') has_male_toilet?: boolean,
    @Query('has_female_toilet') has_female_toilet?: boolean,
    @Query('has_disabled_toilet') has_disabled_toilet?: boolean,
    @Query('has_kids_toilet') has_kids_toilet?: boolean,
    @Query('has_cctv') has_cctv?: boolean,
    @Query('has_emergency_bell') has_emergency_bell?: boolean,
    @Query('has_diaper_changing_station') has_diaper_changing_station?: boolean,
  ) {
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
        has_disabled_toilet,
        has_kids_toilet,
        has_cctv,
        has_emergency_bell,
        has_diaper_changing_station,
      },
    );
  }
}
