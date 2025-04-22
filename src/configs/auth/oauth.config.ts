import { registerAs } from '@nestjs/config';

export default registerAs('oauth', () => ({
  google: {
    clientID: process.env.GOOGLE_REST_API_KEY,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
  },
  kakao: {
    clientID: process.env.KAKAO_REST_API_KEY,
    clientSecret: process.env.KAKAO_SECRET_KEY,
    callbackURL: process.env.KAKAO_REDIRECT_URI,
  },
  naver: {
    clientID: process.env.NAVER_REST_API_KEY,
    clientSecret: process.env.NAVER_SECRET_KEY,
    callbackURL: process.env.NAVER_REDIRECT_URI,
  },
}));
