import { Express } from 'express';
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { Public } from 'src/decorator/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Excel')
@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Public()
  @Post('upload')
  @ApiResponse({
    status: 200,
    description: '엑셀 데이터 저장완료',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseInterceptors(FilesInterceptor('files', 10, { dest: '../../resource' }))
  async uploadExcel(@UploadedFiles() files: Express.Multer.File[]) {
    await this.excelService.processExcelFiles(files);
    return { message: '엑셀 데이터 저장완료' };
  }
}
