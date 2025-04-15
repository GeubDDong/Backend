import { ApiProperty } from '@nestjs/swagger';
import { ToiletBaseDto } from '../base/toilet-base.dto';

export class MemberToiletDto extends ToiletBaseDto {
  @ApiProperty({ description: '즐겨찾기 여부', example: true })
  is_liked: boolean;
}
