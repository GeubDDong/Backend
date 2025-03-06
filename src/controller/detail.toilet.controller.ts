import { Controller, Get, Param } from '@nestjs/common';
import { DetailToiletService } from '../service/detail.toilet.service';

@Controller('detail')
export class DetailToiletController {
  constructor(private readonly detailToiletService: DetailToiletService) {}

  @Get(':id')
  getDetailToilet(@Param() id: string) {
    return this.detailToiletService.getDetailInfo(+id);
  }
}
