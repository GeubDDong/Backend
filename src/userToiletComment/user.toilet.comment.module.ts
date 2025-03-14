import { Module } from '@nestjs/common';
import { UserToiletCommentService } from './user.toilet.comment.service';
import { UserToiletCommentController } from './user.toilet.comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToiletCommentModel } from 'src/entity/user.toilet.comment.entity';
import { JwtStrategy } from 'src/util/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/util/guards/jwt-auth/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/configs/auth/jwt.config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToiletCommentModel]),
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
