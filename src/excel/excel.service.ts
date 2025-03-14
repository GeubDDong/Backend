import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ToiletModel } from '../entity/toilet.entity';
import * as moment from 'moment';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(ToiletModel)
    private readonly toiletRepository: Repository<ToiletModel>,
  ) {}

  async processExcelFile(filePath: string): Promise<void> {
    console.log(`📂 엑셀 파일을 읽는 중: ${filePath}`);

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    await this.toiletRepository.query(
      'TRUNCATE TABLE toilet_model RESTART IDENTITY CASCADE',
    );

    const toilets = rawData.map((row: any) => ({
      name: row['화장실명'] || '알 수 없음',
      street_address: row['소재지도로명주소'] || '알 수 없음',
      lot_address: row['소재지지번주소'] || '알 수 없음',
      disabled_male: row['남성용-장애인용대변기수'] ?? 0,
      kids_toilet_male: row['남성용-어린이용대변기수'] ?? 0,
      disabled_female: row['여성용-장애인용대변기수'] ?? 0,
      kids_toilet_female: row['여성용-어린이용대변기수'] ?? 0,
      management_agency: row['관리기관명'] || '정보 없음',
      phone_number: row['전화번호'] ? row['전화번호'].toString() : '정보 없음',
      open_hour:
        this.convertToStandardOpenHourFormat(row['개방시간상세']) ||
        '정보 없음',
      latitude: row['WGS84위도'] ? parseFloat(row['WGS84위도']) : undefined,
      longitude: row['WGS84경도'] ? parseFloat(row['WGS84경도']) : undefined,
      emergency_bell: row['비상벨설치여부'] || '정보 없음',
      cctv: row['화장실입구CCTV설치유무'] || '정보 없음',
      diaper_changing_station: row['기저귀교환대유무'] || '정보 없음',
      data_reference_date: row['데이터기준일자'] || '정보 없음',
    }));

    // 데이터 쪼개서 저장
    try {
      const chunkSize = 1000;
      for (let i = 0; i < toilets.length; i += chunkSize) {
        const chunk = toilets.slice(i, i + chunkSize);
        await this.toiletRepository.save(chunk);
      }
      console.log('저장완료');
    } catch (error) {
      console.error('오류:', error);
      throw error;
    }

    fs.unlinkSync(filePath);
    console.log(`파일 삭제 완료: ${filePath}`);
  }

  private convertToStandardOpenHourFormat(timeStr: string): string {
    if (!timeStr || typeof timeStr !== 'string') {
      return '정보 없음';
    }

    const alwaysOpenKeywords = [
      '24시간',
      '24시간 운영',
      '00:00~24:00',
      '00:00~00:00',
      '상시',
      '정시',
      '운영시간동안',
      '연중무휴',
      '24시간 개방',
    ];
    if (alwaysOpenKeywords.includes(timeStr.trim())) {
      return '상시 개방';
    }

    timeStr = timeStr.replace(/-/g, ' ~ ');
    const timeRange = timeStr.split('~').map((t) => t.trim());
    if (timeRange.length !== 2) {
      return '정보 없음';
    }
    const startTime = moment(timeRange[0], ['HH:mm', 'h:mm A']);
    const endTime = moment(timeRange[1], ['HH:mm', 'h:mm A']);

    if (!startTime.isValid() || !endTime.isValid()) {
      return '정보 없음';
    }

    const formattedStartTime = startTime
      .format('A h시')
      .replace('AM', '오전')
      .replace('PM', '오후');
    const formattedEndTime = endTime
      .format('A h시')
      .replace('AM', '오전')
      .replace('PM', '오후');
    return `${formattedStartTime} ~ ${formattedEndTime}`;
  }
}
