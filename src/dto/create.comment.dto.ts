import { Type } from 'class-transformer';
import { IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';

export class RatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  accessibility: number;

  @IsInt()
  @Min(1)
  @Max(5)
  amenities: number;

  @IsInt()
  @Min(1)
  @Max(5)
  cleanliness: number;
}

export class CreateCommentDto {
  @IsString()
  comment: string;

  @ValidateNested()
  @Type(() => RatingDto)
  rating: RatingDto;
}
