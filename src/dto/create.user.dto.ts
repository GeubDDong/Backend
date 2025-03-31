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
  id: number;

  @ApiProperty({
    description: '사용자가 지정한 닉네임',
    example: '홍길동',
  })
  username: string;

  @ApiPropertyOptional({
    description: '사용자가 로그인한 경로',
    example: 'kakao',
  })
  provider?: string;
}
