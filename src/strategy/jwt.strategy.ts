import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/configs/auth/jwt.config';
import { AuthService } from '../auth/auth.service';
import { AuthJwtPayload } from '../util/types/auth.jwt.payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 요청 헤더에서 토큰 추출
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false, // 만료된 토큰 거부 => 401 반환
    });
  }

  async validate(payload: AuthJwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid access token');
    }

    // 사용자 정보가 존재하는지 검증
    const user = await this.authService.validateUserById(payload.sub);

    return user;
  }
}
