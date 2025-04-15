import { ApiProperty } from '@nestjs/swagger';

export class ToiletBaseDto {
  @ApiProperty({ description: '화장실 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '화장실 이름', example: '광화문 공공화장실' })
  name: string;

  @ApiProperty({ description: '위도', example: 37.5665 })
  latitude?: number;

  @ApiProperty({ description: '경도', example: 126.978 })
  longitude?: number;

  @ApiProperty({
    description: '도로명 주소',
    example: '서울특별시 종로구 세종대로 1',
  })
  street_address?: string;

  @ApiProperty({ description: '개방 시간', example: '오전 06:00 ~ 22:00' })
  open_hours?: string;

  @ApiProperty({ description: '청결도 평균 평점', example: 4.2 })
  avg_cleanliness: number;

  @ApiProperty({ description: '비품 관리 평균 평점', example: 4.5 })
  avg_amenities: number;

  @ApiProperty({ description: '접근성 평균 평점', example: 4.0 })
  avg_accessibility: number;

  @ApiProperty({ description: '가장 가까운 화장실 여부', example: true })
  nearest: boolean;

  @ApiProperty({
    description: '시설 여부',
    example: {
      has_male_toilet: true,
      has_female_toilet: true,
      has_disabled_toilet: true,
      has_kids_toilet: true,
      has_cctv: true,
      has_emergency_bell: false,
      has_diaper_table: true,
    },
  })
  has_facility: {
    has_male_toilet: boolean;
    has_female_toilet: boolean;
    has_disabled_toilet: boolean;
    has_kids_toilet: boolean;
    has_cctv: boolean;
    has_emergency_bell: boolean;
    has_diaper_table: boolean;
  };
}
