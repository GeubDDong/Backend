import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Toilet } from '../entity/toilet.entity';
import { DataSource, Repository } from 'typeorm';
import { ToiletFilterDto } from 'src/dto/toilet/request/toilet-filter.dto';

@Injectable()
export class ToiletRepository {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
    private readonly dataSource: DataSource,
  ) {}

  async findToiletsInBounds(
    cenLat: number,
    cenLng: number,
    top: number,
    bottom: number,
    left: number,
    right: number,
    filters?: ToiletFilterDto,
  ): Promise<Toilet[]> {
    const qb = this.toiletRepository
      .createQueryBuilder('toilet')
      .leftJoinAndSelect('toilet.facility', 'facility')
      .leftJoinAndSelect('toilet.management', 'management')
      .addSelect(
        `ST_DistanceSphere(
          ST_MakePoint(toilet.longitude::float8, toilet.latitude::float8),
          ST_MakePoint(CAST(:cenLng AS float8), CAST(:cenLat AS float8))
        )`,
        'distance',
      )
      .where('toilet.latitude BETWEEN :bottom AND :top', { top, bottom })
      .andWhere('toilet.longitude BETWEEN :left AND :right', { left, right })
      .setParameters({ cenLat, cenLng });

    this.FilterConditions(qb, filters);

    return await qb.orderBy('distance', 'ASC').getMany();
  }

  private FilterConditions(
    qb: ReturnType<Repository<Toilet>['createQueryBuilder']>,
    filters?: ToiletFilterDto,
  ) {
    if (!filters) return;

    if (filters?.has_cctv === true) {
      qb.andWhere(`facility.cctv = 'Y'`);
    }

    if (filters?.has_emergency_bell === true) {
      qb.andWhere(`facility.emergency_bell = 'Y'`);
    }

    if (filters?.has_diaper_changing_station === true) {
      qb.andWhere(`facility.diaper_changing_station = 'Y'`);
    }

    if (filters?.has_disabled_male_toilet === true) {
      qb.andWhere(`facility.disabled_male_toilet > 0`);
    }

    if (filters?.has_disabled_female_toilet === true) {
      qb.andWhere(`facility.disabled_female_toilet > 0`);
    }

    if (filters?.has_kids_toilet === true) {
      qb.andWhere(`(
        facility.kids_toilet_male > 0 OR
        facility.kids_toilet_female > 0
      )`);
    }

    if (filters?.has_male_toilet === true) {
      qb.andWhere(`facility.male_toilet > 0`);
    }

    if (filters?.has_female_toilet === true) {
      qb.andWhere(`facility.female_toilet > 0`);
    }
  }

  async findOneByToiletId(id: number): Promise<Toilet | null> {
    return await this.toiletRepository.findOne({ where: { id } });
  }

  async getLikeCount(toiletId: number): Promise<number> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('favorite', 'likes')
      .where('likes.toilet_id = :toiletId', { toiletId })
      .getRawOne();

    return Number(result?.count ?? 0);
  }
}
