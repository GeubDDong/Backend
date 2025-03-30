import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      select: ['email', 'id', 'refresh_token'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    const result = await this.usersRepository.update(
      { id: userId },
      { refresh_token: hashedRefreshToken },
    );

    if (!result.affected || result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return { statusCode: 201, message: 'logout successfully' };
  }

  async updateNickname(userId: string, nickname: string) {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });

    if (user) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    await this.usersRepository.update({ id: userId }, { nickname });

    return { statusCode: 201, message: 'nickname created successfully' };
  }
}
