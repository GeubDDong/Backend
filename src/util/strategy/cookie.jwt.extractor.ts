import { Request } from 'express';

export const cookieJwtExtractor = (req: Request): string | null => {
  const token = req?.cookies?.accessToken;
  console.log('토큰여깄써염', token);
  return req?.cookies?.['accessToken'] ?? null;
};
