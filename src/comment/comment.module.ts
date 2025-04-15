import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { JwtStrategy } from 'src/util/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/util/guards/jwt-auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/configs/auth/jwt.config';
import { AuthModule } from '../auth/auth.module';
import { CommentsRepository } from './comment.repository';
import { User } from 'src/entity/user.entity';
import { UsersRepository } from 'src/user/user.repository';
import { CommentSubscriber } from './comment.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User]),
    ConfigModule.forFeature(jwtConfig),
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    CommentsRepository,
    UsersRepository,
    CommentSubscriber,
  ],
  exports: [CommentsRepository],
})
export class CommentModule {}
