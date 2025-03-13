// import { Injectable } from '@nestjs/common';
// import * as XLSX from 'xlsx';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ToiletModel } from '../entity/toilet.entity';
// import * as fs from 'fs';

// @Injectable()
// export class ExcelService {
//   constructor(
//     @InjectRepository(ToiletModel)
//     private readonly toiletRepository: Repository<ToiletModel>,
//   ) {}

//   async processExcelFile(filePath: string): Promise<void> {
//     const fileBuffer = fs.readFileSync(filePath);
//     const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

//     const toilets: Partial<ToiletModel>[] = jsonData.map((row) => {
//       return this.mapRowToEntity(row);
//     });

//     await this.toiletRepository.save(toilets);

//     fs.unlinkSync(filePath);
//   }

//   private mapRowToEntity(row: any): ToiletModel {
//     return this.toiletRepository.create({
//       name: row['화장실명'] || '정보 없음',
//       street_address: row['소재지도로명주소'] || '정보 없음',
//       lot_address: row['소재지지번주소'] || '정보 없음',
//       emergency_bell: row['비상벨설치여부'] === 'Y' ? true : false,
//       cctv: row['화장실입구CCTV설치유무'] === 'Y' ? true : false,
//       diaper_changing_station: row['기저귀교환대유무'] === 'Y' ? true : false,
//       data_reference_date: row['데이터기준일자']
//         ? new Date(row['데이터기준일자'])
//         : null,
//     });
//   }
// }
