// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ExcelService } from '../service/excel.service';

// @Controller('excel')
// export class ExcelController {
//   constructor(private readonly excelService: ExcelService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadExcel(@UploadedFile() file: Express.Multer.File) {
//     await this.excelService.processExcelFile(file.path);
//     return { message: '엑셀 데이터가 성공적으로 저장되었습니다.' };
//   }
// }
