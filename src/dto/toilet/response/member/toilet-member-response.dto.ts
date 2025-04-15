import { ApiProperty } from '@nestjs/swagger';
import { PublicToiletDto } from '../public/toilet-public-response.dto';

export class MemberToiletDto extends PublicToiletDto {
  @ApiProperty({ description: '즐겨찾기 여부', example: true })
  is_liked: boolean;
}
