import {
  KakaoProfile,
  GoogleProfile,
  NaverProfile,
} from './types/oauthProfile.interface';

export type OAuthProvider = 'kakao' | 'google' | 'naver';

interface BaseUserProfile {
  id: string;
  email: string;
  profile_image: string;
}

export interface OAuthProviderConfig<T> {
  tokenUrl: string;
  userInfoUrl: string;
  extractProfile: (data: T) => BaseUserProfile;
}

type OAuthProviderMap = {
  kakao: OAuthProviderConfig<KakaoProfile>;
  google: OAuthProviderConfig<GoogleProfile>;
  naver: OAuthProviderConfig<NaverProfile>;
};

export const OAuthProviders: OAuthProviderMap = {
  kakao: {
    tokenUrl: 'https://kauth.kakao.com/oauth/token',
    userInfoUrl: 'https://kapi.kakao.com/v2/user/me',
    extractProfile: (data) => ({
      id: data.id,
      email: data.kakao_account.email,
      profile_image: data.kakao_account.profile?.thumbnail_image_url ?? '',
    }),
  },

  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    extractProfile: (data) => ({
      id: data.id,
      email: data.email,
      profile_image: data.picture ?? '',
    }),
  },

  naver: {
    tokenUrl: 'https://nid.naver.com/oauth2.0/token',
    userInfoUrl: 'https://openapi.naver.com/v1/nid/me',
    extractProfile: (data) => ({
      id: data.response.id,
      email: data.response.email,
      profile_image: data.response.profile_image ?? '',
    }),
  },
};
