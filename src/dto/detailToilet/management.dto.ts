import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ManagementDto {
  @Expose()
  @ApiProperty({ example: '현대차' })
  name: string;

  @Expose()
  @ApiProperty({ example: '031-2323-4645' })
  phone_number: string;
}
