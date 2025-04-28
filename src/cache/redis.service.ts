// import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
// import { rejects } from 'assert';
// import Redis from 'ioredis';
// import { resolve } from 'path';

// @Injectable()
// export class RedisService implements OnModuleDestroy {
//   constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

//   async set(key: string, value: any, ttl?: number): Promise<void> {
//     const stringValue = JSON.stringify(value);
//     if (ttl) {
//       await this.redisClient.set(key, stringValue, 'EX', ttl); // TTL 적용
//     } else {
//       await this.redisClient.set(key, stringValue);
//     }
//   }

//   async get<T>(key: string): Promise<T | null> {
//     const value = await this.redisClient.get(key);
//     return value ? JSON.parse(value) : null;
//   }

//   async del(key: string): Promise<number> {
//     return this.redisClient.del(key);
//   }

//   async flushAll(): Promise<void> {
//     await this.redisClient.flushall();
//   }

//   async scanKeys(pattern: string): Promise<string[]> {
//     const stream = this.redisClient.scanStream({ match: pattern });
//     const keys: string[] = [];

//     return new Promise((resolve, reject) => {
//       stream.on('data', (resultKeys: string[]) => {
//         for (const key of resultKeys) {
//           keys.push(key);
//         }
//       });
//       stream.on('end', () => {
//         resolve(keys);
//       });
//       stream.on('err', (err) => {
//         reject(err);
//       });
//     });
//   }

//   onModuleDestroy() {
//     this.redisClient.quit();
//   }
// }
