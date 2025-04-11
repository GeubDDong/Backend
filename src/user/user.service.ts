import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { User } from '../entity/user.entity';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
  ) {}

  async findBySocialId(socialId: string): Promise<User | null> {
    const existUser = await this.usersRepository.findBySocialId(socialId);

    if (!existUser) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    return existUser;
  }

  async getAuthPayloadBySocialId(socialId: string) {
    const existUser = await this.usersRepository.findPayload(socialId);

    if (!existUser) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    return existUser;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.usersRepository.createUser(createUserDto);
    if (!newUser) {
      throw new InternalServerErrorException('유저 생성에 실패했습니다.');
    }

    return newUser;
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
