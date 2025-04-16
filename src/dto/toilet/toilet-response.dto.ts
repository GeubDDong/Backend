import { ApiProperty } from '@nestjs/swagger';

export class ToiletSummaryDto {
  @ApiProperty({ description: '화장실 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '화장실 이름', example: '광화문 공공화장실' })
  name: string;

  @ApiProperty({ description: '즐겨찾기 여부', example: true })
  is_liked: boolean;
}

export class ToiletMapResponseDto {
  @ApiProperty({ example: 36.5285 })
  marker_latitude: number;

  @ApiProperty({ example: 127.1234 })
  marker_longitude: number;

  @ApiProperty({ type: [ToiletSummaryDto] })
  toilets: ToiletSummaryDto[];
}
