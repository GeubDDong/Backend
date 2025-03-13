import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailToiletResponseDto } from 'src/dto/detail.toilet.response.dto';
import { ToiletModel } from 'src/entitiy/toilet.entity';
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
      throw new NotFoundException(
        `${id}에 해당하는 화장실 정보를 찾을 수 없습니다.`,
      );
    }

    return new DetailToiletResponseDto(toiletInfo);
  }
}
