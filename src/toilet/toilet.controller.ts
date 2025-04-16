import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { ToiletService } from './toilet.service';
import { Request } from 'express';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ToiletRequestDto } from 'src/dto/toilet/request/toilet-request.dto';

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
    @Query('has_male_toilet') hasMaleToilet?: boolean,
    @Query('has_female_toilet') hasFemaleToilet?: boolean,
    @Query('has_disabled_toilet') hasDisabledToilet?: boolean,
    @Query('has_kids_toilet') hasKidsToilet?: boolean,
    @Query('has_cctv') hasCCTV?: boolean,
    @Query('has_emergency_bell') hasEmergencyBell?: boolean,
    @Query('has_diaper_changing_station')
    hasDiaperChangingStation?: boolean
    @Req() req: Request,
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
      filters:{
        hasMaleToilet,
        hasFemaleToilet,
        hasDisabledToilet,
        hasKidsToilet,
        hasCCTV,
        hasEmergencyBell,
        hasDiaperChangingStation
      }
    );
  }
}
