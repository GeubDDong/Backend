export interface KakaoProfile {
  id: string;
  kakao_account: {
    email: string;
    profile?: {
      thumbnail_image_url?: string;
    };
  };
}

export interface GoogleProfile {
  id: string;
  email: string;
  picture?: string;
}

export interface NaverProfile {
  response: {
    id: string;
    email: string;
    profile_image?: string;
  };
}
