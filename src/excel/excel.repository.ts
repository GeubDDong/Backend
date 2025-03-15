import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ToiletModel } from '../entity/toilet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExcelRepository {
  constructor(
    @InjectRepository(ToiletModel)
    private readonly toiletRepository: Repository<ToiletModel>,
  ) {}

  async saveExcelData(toilets: Partial<ToiletModel>[]): Promise<void> {
    try {
      await this.toiletRepository.save(toilets);
    } catch (error) {
      throw error;
    }
  }
}
