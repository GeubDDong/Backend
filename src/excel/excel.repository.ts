import { EntityRepository, Repository } from 'typeorm';
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
    console.log('📂 엑셀 데이터 미리보기:', JSON.stringify(toilets, null, 2));
    if (!toilets.length) {
      console.warn('⚠️ 저장할 데이터가 없습니다.');
      return;
    }

    try {
      console.log(`📂 ${toilets.length}개의 데이터를 DB에 저장합니다.`);
      await this.toiletRepository.save(toilets);
    } catch (error) {
      throw error;
    }
  }
}
