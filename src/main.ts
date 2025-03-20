import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'https://geubddong-deploy.vercel.app',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('GeubDDong')
    .setDescription('GeubDDong API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('jwt', {
      type: 'apiKey',
      in: 'cookie',
    })
    .addServer("https://geubddong.com")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
