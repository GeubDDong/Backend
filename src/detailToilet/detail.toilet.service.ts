import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DetailToiletResponseDto } from 'src/dto/detail.toilet.response.dto';
import { Toilet } from 'src/entity/toilet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailToiletService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async getDetailInfo(id: number): Promise<DetailToiletResponseDto> {
    // const cacheKey=`toilet:detail:${toilet}`
    const toiletInfo = await this.toiletRepository.findOne({
      where: { id: id },
      relations: ['facility', 'management'],
    });

    if (!toiletInfo) {
      throw new NotFoundException(
        `${id}에 해당하는 화장실 정보를 찾을 수 없습니다.`,
      );
    }

    return plainToInstance(DetailToiletResponseDto, toiletInfo);
  }
}
