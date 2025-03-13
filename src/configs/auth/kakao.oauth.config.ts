import { registerAs } from '@nestjs/config';

export default registerAs('kakaoOAuth', () => ({
  clientID: process.env.KAKAO_REST_API_KEY,
  clientSecret: process.env.KAKAO_SECRET_KEY,
  callbackURL: process.env.KAKAO_REDIRECT_URI,
}));
