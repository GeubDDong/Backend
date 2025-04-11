import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FacilityDto {
  @Expose() @ApiProperty() male_toilet: number;
  @Expose() @ApiProperty() male_urinal: number;
  @Expose() @ApiProperty() disabled_male_toilet: number;
  @Expose() @ApiProperty() disabled_male_urinal: number;
  @Expose() @ApiProperty() kids_toilet_male: number;
  @Expose() @ApiProperty() female_toilet: number;
  @Expose() @ApiProperty() disabled_female_toilet: number;
  @Expose() @ApiProperty() kids_toilet_female: number;
  @Expose() @ApiProperty() emergency_bell: string;
  @Expose() @ApiProperty() cctv: string;
  @Expose() @ApiProperty() diaper_changing_station: string;
  @Expose() @ApiProperty() reference_date: string;
}
