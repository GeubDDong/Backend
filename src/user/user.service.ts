import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/auth/create.user.dto';
import { User } from '../entity/user.entity';
import { UsersRepository } from './user.repository';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { generateRandomDigits } from 'src/util/common/random.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly httpService: HttpService,
  ) {}

  async findBySocialId(socialId: string): Promise<User | null> {
    const existUser = await this.usersRepository.findBySocialId(socialId);

    return existUser;
  }

  async getAuthPayloadBySocialId(socialId: string) {
    const existUser = await this.usersRepository.findPayload(socialId);

    if (!existUser) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    return existUser;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const nickname = await this.getRandomNickname();

    const newUser = await this.usersRepository.createUser(
      createUserDto,
      nickname,
    );
    if (!newUser) {
      throw new InternalServerErrorException('유저 생성에 실패했습니다.');
    }

    return newUser;
  }

  private async getRandomNickname(): Promise<string> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.post(
          'https://www.rivestsoft.com/nickname/getRandomNickname.ajax',
          {
            lang: 'ko',
          },
        ),
      );

      const nickname = data.data;

      const exists = await this.usersRepository.checkAlreadyNickname(nickname);

      if (exists) return `${nickname}${generateRandomDigits(4)}`; // 중복이면 랜덤 숫자 생성

      return nickname; // 중복 없으면 그대로 반환
    } catch (e) {
      return `User${generateRandomDigits(5)}`; // API 실패시 fallback
    }
  }

  async storeHashedRefreshToken(
    socialId: string,
    hashedRefreshToken: string | null,
  ) {
    const storedToken = await this.usersRepository.storeHashedRefreshToken(
      socialId,
      hashedRefreshToken,
    );

    if (!storedToken.affected || storedToken.affected === 0) {
      throw new NotFoundException('User not found!!');
    }

    return { statusCode: 201, message: 'logout successfully' };
  }

  async setNickname(socialId: string, nickname: string) {
    console.log('setNickname socialID', socialId);

    const user = await this.usersRepository.checkAlreadyNickname(nickname);

    if (user) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    await this.usersRepository.setNickname(socialId, nickname);

    return { statusCode: 201, message: 'nickname created successfully' };
  }
}
