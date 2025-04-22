import {
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ToiletBoundsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  cenLat: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  cenLng: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  top: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  bottom: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  left: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  right: number;
}

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

export class ToiletMapRequestDto {
  @ApiProperty({ type: ToiletBoundsDto })
  @ValidateNested()
  @Type(() => ToiletBoundsDto)
  bounds: ToiletBoundsDto;

  @ApiProperty({ type: ToiletFilterDto })
  @ValidateNested()
  @Type(() => ToiletFilterDto)
  filters: ToiletFilterDto;
}
