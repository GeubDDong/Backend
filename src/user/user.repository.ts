import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/auth/create.user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findBySocialId(socialId: string) {
    const result = await this.usersRepository.findOne({
      where: { social_id: socialId },
    });

    return result;
  }

  async findPayload(socialId: string) {
    const result = await this.usersRepository.findOne({
      where: { social_id: socialId },
      select: ['email', 'social_id', 'refresh_token'],
    });

    return result;
  }

  async createUser(createUserDto: CreateUserDto, nickname: string) {
    const newUser = this.usersRepository.create({
      social_id: createUserDto.socialId,
      email: createUserDto.email,
      profile_image: createUserDto.profile_image,
      provider: createUserDto.provider,
      nickname,
    });

    const result = await this.usersRepository.save(newUser);

    return result;
  }

  async checkAlreadyNickname(nickname: string) {
    const result = await this.usersRepository.findOne({
      where: { nickname },
    });

    return result;
  }

  async setNickname(socialId: string, nickname: string) {
    const result = await this.usersRepository.update(
      { social_id: socialId },
      { nickname },
    );

    return result;
  }

  async storeHashedRefreshToken(
    socialId: string,
    hashedRefreshToken: string | null,
  ) {
    const result = await this.usersRepository.update(
      { social_id: socialId },
      { refresh_token: hashedRefreshToken },
    );

    return result;
  }
}
