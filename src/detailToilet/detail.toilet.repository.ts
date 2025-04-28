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

  async findRatingList(toiletId: number): Promise<any> {
    const result = await this.detailToiletRepository.findOne({
      select: [
        'id',
        'avg_rating',
        'avg_cleanliness',
        'avg_amenities',
        'avg_accessibility',
      ],
      where: { id: toiletId },
    });

    if (!result) {
      throw new NotFoundException('화장실을 찾을 수 없습니다.');
    }

    return {
      avg_rating: result.avg_rating,
      avg_cleanliness: result.avg_cleanliness,
      avg_amenities: result.avg_amenities,
      avg_accessibility: result.avg_accessibility,
    };
  }
}
