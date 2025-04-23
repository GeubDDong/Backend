import { ApiProperty } from '@nestjs/swagger';

export class MyFavoriteToiletDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  street_address: string;

  @ApiProperty()
  lot_address: string;

  @ApiProperty()
  avg_cleanliness: number;

  @ApiProperty()
  avg_amenities: number;

  @ApiProperty()
  avg_accessibility: number;
}

export class ReviewToiletInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class MyReviewDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  toilet: ReviewToiletInfoDto;

  @ApiProperty()
  profile_image: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  avg_rating: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class MyPageResponseDto {
  @ApiProperty({ type: [MyFavoriteToiletDto] })
  favorites: MyFavoriteToiletDto[];

  @ApiProperty({ type: [MyReviewDto] })
  reviews: MyReviewDto[];
}
