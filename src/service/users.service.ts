import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { UsersModel } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: ['email', 'id', 'refresh_token'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    console.log('create', createUserDto);
    return await this.usersRepository.save(createUserDto);
  }

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null,
  ) {
    return await this.usersRepository.update(
      { id: userId },
      { refresh_token: hashedRefreshToken },
    );
  }

  async updateNickname(userId: number, nickname: string) {
    const user = await this.usersRepository.findOne({
      where: { nickname },
    });

    if (user) {
      return {
        statusCode: 409,
        message: '이미 존재하는 닉네임입니다.',
        error: 'Conflict',
      };
    }

    await this.usersRepository.update({ id: userId }, { nickname });

    return { statusCode: 201, message: 'success generateNickname' };
  }
}
