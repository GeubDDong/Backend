import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ManagementDto } from './management.dto';
import { FacilityDto } from './facility.dto';

@Exclude()
export class DetailToiletResponseDto {
  @Expose()
  @ApiProperty({ description: '화장실 ID', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: '화장실 이름', example: '광화문 공공화장실' })
  name: string;

  @Expose()
  @ApiPropertyOptional({
    description: '도로명 주소',
    example: '서울특별시 종로구 세종대로 1',
  })
  street_address?: string;

  @Expose()
  @ApiPropertyOptional({
    description: '지번 주소',
    example: '서울특별시 종로구 청진동 149',
  })
  lot_address?: string;

  @Expose()
  @ApiProperty({ description: '위도', example: 37.5665 })
  latitude?: number;

  @Expose()
  @ApiProperty({ description: '경도', example: 126.978 })
  longitude?: number;

  @Expose()
  @ApiProperty({ description: '청결도', example: 5 })
  avg_cleanliness: number;

  @Expose()
  @ApiProperty({ description: '편의성', example: 4 })
  avg_amenities: number;

  @Expose()
  @ApiProperty({ description: '접근성', example: 4 })
  avg_accessibility: number;

  @Expose()
  @ApiProperty({ description: '개방 시간', example: '오전 06:00 ~ 22:00' })
  open_hour: string;

  @Expose()
  @ApiProperty({ description: '평균 평점', example: 3.5 })
  avg_rating: number;

  @Expose()
  @Type(() => ManagementDto)
  @ApiProperty({ description: '관리 주체 정보' })
  management: ManagementDto;

  @Expose()
  @Type(() => FacilityDto)
  @ApiProperty({ description: '시설 정보' })
  facility: FacilityDto;
}
