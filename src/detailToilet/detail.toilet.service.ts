import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DetailToiletResponseDto } from 'src/dto/detailToilet/detail.toilet.response.dto';
import { Toilet } from 'src/entity/toilet.entity';
import { DetailToiletRepository } from './detail.toilet.repository';

@Injectable()
export class DetailToiletService {
  constructor(
    private readonly detailToiletRepository: DetailToiletRepository,
  ) {}

  async getDetailInfo(id: number): Promise<DetailToiletResponseDto> {
    const toiletInfo: Toilet =
      await this.detailToiletRepository.findDetailInfoById(id);

    return plainToInstance(DetailToiletResponseDto, toiletInfo, {
      excludeExtraneousValues: true,
    });
  }
}
