import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailToiletRepository {
  constructor(
    @InjectRepository(Toilet)
    private readonly detailToiletRepository: Repository<Toilet>,
  ) {}

  async findDetailInfoById(id: number): Promise<Toilet> {
    const result = await this.detailToiletRepository.findOne({
      where: { id: id },
      relations: ['facility', 'management'],
    });

    if (!result) {
      throw new NotFoundException(
        `${id}에 해당하는 화장실 정보를 찾을 수 없습니다.`,
      );
    }

    return result;
  }
}
