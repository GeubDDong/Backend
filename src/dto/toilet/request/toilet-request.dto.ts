import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ToiletRequestDto {
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
  has_diaper_changing_station?: boolean;
}
