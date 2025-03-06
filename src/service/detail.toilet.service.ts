import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailToiletResponseDto } from 'src/dto/detail.toilet.response.dto';
import { ToiletModel } from 'src/entities/toilet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailToiletService {
  constructor(
    @InjectRepository(ToiletModel)
    private readonly toiletRepository: Repository<ToiletModel>,
  ) {}

  async getDetailInfo(id: number): Promise<DetailToiletResponseDto> {
    const toiletInfo = await this.toiletRepository.findOne({
      where: { id: id },
    });

    if (!toiletInfo) {
      throw new NotFoundException('찾을 수 없는 id입니다.');
    }

    return {
      ...toiletInfo,
      disabled_male: toiletInfo.disabled_male > 0 ? 'Y' : 'N',
      kids_toilet_male: toiletInfo.kids_toilet_male > 0 ? 'Y' : 'N',
      disabled_female: toiletInfo.disabled_female > 0 ? 'Y' : 'N',
      kids_toilet_female: toiletInfo.kids_toilet_femaie > 0 ? 'Y' : 'N',
    };
  }
}
