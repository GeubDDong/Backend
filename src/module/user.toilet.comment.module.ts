import { Module } from '@nestjs/common';
import { UserToiletCommentService } from '../service/user.toilet.comment.service';
import { UserToiletCommentController } from '../controller/user.toilet.comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToiletCommentModel } from 'src/entities/user.toilet.comment.entity';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/configs/auth/jwt.config';
import { AuthModule } from './auth.module';
import { UsersModel } from 'src/entities/users.entity';
import { ToiletModel } from 'src/entities/toilet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToiletCommentModel, UsersModel, ToiletModel]),
    ConfigModule.forFeature(jwtConfig),
    AuthModule,
  ],
  controllers: [UserToiletCommentController],
  providers: [
    UserToiletCommentService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [UserToiletCommentService],
})
export class UserToiletCommentModule {}
