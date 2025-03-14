import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { Express } from 'express';
import { Public } from 'src/decorator/public.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../../resource',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    console.log('파일 업로드됨:', file.path);
    await this.excelService.processExcelFile(file.path);
    return { message: '엑셀 데이터 저장완료' };
  }
}
