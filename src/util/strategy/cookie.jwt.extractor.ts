import { Request } from 'express';

export const cookieJwtExtractor = (req: Request): string | null => {
  return req?.cookies?.['accessToken'] ?? null;
};
