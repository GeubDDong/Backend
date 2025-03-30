import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Toilet } from 'src/entity/toilet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExcelRepository {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepository: Repository<Toilet>,
  ) {}

  async saveExcelData(toilets: Partial<Toilet>[]): Promise<void> {
    try {
      await this.toiletRepository.save(toilets);
    } catch (error) {
      throw error;
    }
  }
}
