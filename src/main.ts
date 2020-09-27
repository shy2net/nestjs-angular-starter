import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  // Create the app and allow cors
  const app = await NestFactory.create(AppModule, {
    cors: config.CORS_OPTIONS,
  });

  // Use '/api' for general prefix
  app.setGlobalPrefix('api');

  // Allow validation and transform of params
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Start listening
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
