import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';

export class SetNicknameDto {
  @Transform(({ value }) => String(value))
  @IsString()
  @MaxLength(10, { message: '닉네임은 최대 10글자까지만 가능합니다.' })
  @Matches(/^[가-힣a-zA-Z][가-힣a-zA-Z0-9]*$/, {
    message:
      '닉네임은 한글, 영문, 숫자만 사용 가능하며 첫 글자는 숫자가 될 수 없습니다.',
  })
  nickname: string;
}
