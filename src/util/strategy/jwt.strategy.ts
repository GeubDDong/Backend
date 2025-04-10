import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/configs/auth/jwt.config';
import { AuthService } from '../../auth/auth.service';
import { AuthJwtPayload } from 'src/util/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AuthJwtPayload) {
    if (!payload || !payload.socialId) {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.authService.validateUserBySocialId(
      payload.socialId,
    );

    return user;
  }
}
