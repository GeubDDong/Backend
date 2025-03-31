import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Toilet } from 'src/entity/toilet.entity';
import { ToiletFacility } from 'src/entity/toilet_facility.entity';
import { Management } from 'src/entity/management.entity';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as moment from 'moment';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(Toilet)
    private readonly toiletRepo: Repository<Toilet>,
    @InjectRepository(ToiletFacility)
    private readonly facilityRepo: Repository<ToiletFacility>,
    @InjectRepository(Management)
    private readonly managementRepo: Repository<Management>,
    private readonly dataSource: DataSource,
  ) {}

  async processExcelFiles(files: Express.Multer.File[]): Promise<void> {
    for (const file of files) {
      const workbook = xlsx.readFile(file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = xlsx.utils.sheet_to_json(sheet);

      const chunkSize = 300;
      const toiletsToSave: Toilet[] = [];

      for (const row of rows) {
        const managementName = row['관리기관명']?.trim() || '알 수 없음';

        let management = await this.managementRepo.findOne({
          where: { name: managementName },
        });

        if (!management) {
          management = this.managementRepo.create({
            name: managementName,
            phone_number: row['전화번호']?.toString() || '알 수 없음',
          });
          management = await this.managementRepo.save(management);
        }

        const toilet = this.toiletRepo.create({
          name: row['화장실명'] || '알 수 없음',
          street_address: row['소재지도로명주소'] || '알 수 없음',
          lot_address: row['소재지지번주소'] || '알 수 없음',
          latitude: parseFloat(row['WGS84위도']) || undefined,
          longitude: parseFloat(row['WGS84경도']) || undefined,
          open_hour: this.formatOpenHour(row['개방시간상세']),
          management,
        });

        const facility = this.facilityRepo.create({
          male_toilet: row['남성용-대변기수'] ?? 0,
          male_urinal: row['남성용-소변기수'] ?? 0,
          disabled_male_toilet: row['남성용-장애인용대변기수'] ?? 0,
          disabled_male_urinal: row['남성용-장애인용소변기수'] ?? 0,
          kids_toilet_male: row['남성용-어린이용대변기수'] ?? 0,
          female_toilet: row['여성용-대변기수'] ?? 0,
          disabled_female_toilet: row['여성용-장애인용대변기수'] ?? 0,
          kids_toilet_female: row['여성용-어린이용대변기수'] ?? 0,
          emergency_bell: row['비상벨설치여부']?.trim() || 'N',
          cctv: row['화장실입구CCTV설치유무']?.trim() || 'N',
          diaper_changing_station: row['기저귀교환대유무']?.trim() || 'N',
          reference_date: this.parseDate(row['데이터기준일자']),
        });

        toilet.facility = facility;
        toiletsToSave.push(toilet);
      }

      for (let i = 0; i < toiletsToSave.length; i += chunkSize) {
        const chunk = toiletsToSave.slice(i, i + chunkSize);

        await this.dataSource.transaction(async (manager) => {
          for (const toilet of chunk) {
            const facility = await manager.save(
              ToiletFacility,
              toilet.facility,
            );
            toilet.facility = facility;
            await manager.save(Toilet, toilet);
          }
        });
      }

      fs.unlinkSync(file.path); // 파일 삭제
    }
  }

  private formatOpenHour(raw: string): string {
    if (!raw || typeof raw !== 'string') return '상시 개방';

    const always = ['24시간', '00:00~24:00', '연중무휴', '상시'];
    if (always.includes(raw.trim())) return '상시 개방';

    const [start, end] = raw
      .replace(/-/g, '~')
      .split('~')
      .map((s) => s.trim());
    const s = moment(start, ['HH:mm', 'h:mm A']);
    const e = moment(end, ['HH:mm', 'h:mm A']);

    if (!s.isValid() || !e.isValid()) return '상시 개방';

    return `${s.format('A h시').replace('AM', '오전').replace('PM', '오후')} ~ ${e.format('A h시').replace('AM', '오전').replace('PM', '오후')}`;
  }

  private parseDate(value: string): Date {
    const parsed = moment(value, ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD']);
    return parsed.isValid() ? parsed.toDate() : new Date();
  }
}
