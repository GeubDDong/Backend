import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MypageRepository } from './mypage.repository';
import { plainToInstance } from 'class-transformer';
import {
  MyFavoriteToiletDto,
  MyPageResponseDto,
  MyReviewDto,
} from 'src/dto/mypage/response/mypage-response.dto';

@Injectable()
export class MypageService {
  constructor(private readonly mypageRepository: MypageRepository) {}

  async getMyPage(userSocialId: string): Promise<MyPageResponseDto> {
    if (!userSocialId) {
      throw new UnauthorizedException('회원 정보가 없습니다.');
    }

    const favorites =
      await this.mypageRepository.findFavoriteToiletsBySocialId(userSocialId);
    const reviews =
      await this.mypageRepository.findReviewsBySocialId(userSocialId);

    return {
      favorites: plainToInstance(MyFavoriteToiletDto, favorites),
      reviews: plainToInstance(MyReviewDto, reviews),
    };
  }
}
