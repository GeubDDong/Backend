import { Request as Req } from 'express';

declare module 'express' {
  interface Request extends Req {
    user: {
      email: string;
      id: number;
      username: string;
      provider: string;
      profile_image: string;
      refresh_token?: string;
      isNewUser: boolean;
    };
  }
}
