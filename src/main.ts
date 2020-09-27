import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use '/api' for general prefix
  app.setGlobalPrefix('api');

  // Allow validation and transform of params
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Enable CORS to allow web access
  app.enableCors();

  // Start listening
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
