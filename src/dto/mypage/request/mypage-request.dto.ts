import { ApiProperty } from '@nestjs/swagger';

export class MyPageRequestDto {
  @ApiProperty({ description: '소셜 ID', example: 'kakao_123' })
  socialId: string;
}
