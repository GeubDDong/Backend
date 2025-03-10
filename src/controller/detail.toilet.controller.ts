import { Controller, Get, Param } from '@nestjs/common';
import { DetailToiletService } from '../service/detail.toilet.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('detail')
export class DetailToiletController {
  constructor(private readonly detailToiletService: DetailToiletService) {}
  @Public()
  @Get(':id')
  getDetailToilet(@Param('id') id: string) {
    return this.detailToiletService.getDetailInfo(+id);
  }
}
