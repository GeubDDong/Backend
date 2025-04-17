import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ToiletRequestDto {
  @ApiProperty()
  @IsNumber()
  cenLat: number;

  @ApiProperty()
  @IsNumber()
  cenLng: number;

  @ApiProperty()
  @IsNumber()
  top: number;

  @ApiProperty()
  @IsNumber()
  bottom: number;

  @ApiProperty()
  @IsNumber()
  left: number;

  @ApiProperty()
  @IsNumber()
  right: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_male_toilet?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_female_toilet?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_disabled_male_toilet?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_disabled_female_toilet?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_kids_toilet?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_cctv?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  has_emergency_bell?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  diaper_changing_station?: boolean;
}
