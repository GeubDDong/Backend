export type OAuthProvider = 'kakao' | 'google' | 'naver';

export interface OAuthProviderConfig {
  tokenUrl: string;
  userInfoUrl: string;
  extractProfile: (data: any) => {
    id: string;
    email: string;
    profile_image: string;
  };
}

export const OAuthProviders: Record<OAuthProvider, OAuthProviderConfig> = {
  kakao: {
    tokenUrl: 'https://kauth.kakao.com/oauth/token',
    userInfoUrl: 'https://kapi.kakao.com/v2/user/me',
    extractProfile: (data: any) => ({
      id: data.id,
      email: data.kakao_account.email,
      profile_image: data.kakao_account.profile?.thumbnail_image_url ?? '',
    }),
  },

  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    extractProfile: (data: any) => ({
      id: data.id,
      email: data.email,
      profile_image: data.picture ?? '',
    }),
  },

  naver: {
    tokenUrl: 'https://nid.naver.com/oauth2.0/token',
    userInfoUrl: 'https://openapi.naver.com/v1/nid/me',
    extractProfile: (data: any) => ({
      id: data.response.id,
      email: data.response.email,
      profile_image: data.response.profile_image ?? '',
    }),
  },
};
