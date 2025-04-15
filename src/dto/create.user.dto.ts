import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '회원 ID',
    example: 234,
  })
  socialId: string;

  @ApiProperty({
    description: '프로필 이미지',
    example:
      'http://k.kakaocdn.net/dn/isqYD/btsMIDcNbdn/MxiPPNlqtw8XUYYe21wec0/img_110x110.jpg',
  })
  profile_image: string;

  @ApiPropertyOptional({
    description: '사용자가 로그인한 경로',
    example: 'kakao',
  })
  provider?: string;
}
