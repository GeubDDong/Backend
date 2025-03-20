import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ToiletDto {
  @ApiProperty({
    description: '화장실 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '화장실 이름',
    example: '광화문 공공화장실',
  })
  name: string;

  @ApiPropertyOptional({
    description: '도로명 주소',
    example: '서울 특별시 종로구 세종대로 1',
  })
  street_address?: string;

  @ApiPropertyOptional({
    description: '지번 주소',
    example: '서울특별시 종로구 청진동 149',
  })
  lot_address?: string;

  @ApiProperty({
    description: '위도',
    example: 37.5665,
  })
  latitude?: number;

  @ApiProperty({
    description: '경도',
    example: 126.978,
  })
  longitude?: number;

  @ApiProperty({
    description: '개방 시간',
    example: '오전 06:00 ~ 22:00',
  })
  open_hours?: string;

  @ApiProperty({
    description: '좋아요 정보',
    example: { like: true, count: 10 },
  })
  liked?: {
    like: boolean;
    count: number;
  };

  @ApiProperty({
    description: '가장 가까운 화장실 여부',
    example: true,
  })
  nearest: boolean;
}
