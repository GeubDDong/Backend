import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ToiletFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_male_toilet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_female_toilet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_disabled_male_toilet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_disabled_female_toilet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_kids_toilet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_cctv?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_emergency_bell?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  has_diaper_changing_station?: boolean;
}
