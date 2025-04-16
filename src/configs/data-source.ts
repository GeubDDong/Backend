import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  timezone: 'Asia/Seoul',
});
