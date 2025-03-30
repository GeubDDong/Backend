import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ToiletDto } from './toilet.dto';

export class DetailToiletResponseDto extends ToiletDto {
  @ApiProperty({ description: '관리기관명', example: '종로구청' })
  management_agency: string;

  @ApiProperty({ description: '전화번호', example: '02-1234-5678' })
  phone_number: string;

  @ApiProperty({ description: '남성용 대변기 수', example: 2 })
  male_toilet: number;

  @ApiProperty({ description: '남성용 소변기 수', example: 3 })
  male_urinal: number;

  @ApiProperty({ description: '남성용 장애인용 대변기 수', example: 1 })
  disabled_male_toilet: number;

  @ApiProperty({ description: '남성용 장애인용 소변기 수', example: 0 })
  disabled_male_urinal: number;

  @ApiProperty({ description: '남성용 어린이용 대변기 수', example: 1 })
  kids_toilet_male: number;

  @ApiProperty({ description: '여성용 대변기 수', example: 5 })
  female_toilet: number;

  @ApiProperty({ description: '여성용 장애인용 대변기 수', example: 1 })
  disabled_female_toilet: number;

  @ApiProperty({ description: '여성용 어린이용 대변기 수', example: 1 })
  kids_toilet_female: number;

  @ApiProperty({ description: '비상벨 설치 여부', example: 'Y' })
  emergency_bell: string;

  @ApiProperty({ description: '화장실 입구 CCTV 설치 여부', example: 'N' })
  cctv: string;

  @ApiProperty({ description: '기저귀 교환대 유무', example: 'Y' })
  diaper_changing_station: string;

  @ApiProperty({ description: '데이터 기준일자', example: '2024-03-01' })
  reference_date: Date;
}
