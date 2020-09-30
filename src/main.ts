import * as express from 'express';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './config';
import { getHttpsOptionsFromConfig } from './misc';
import { mountAngular, mountAngularSSR } from './misc/angular-mounter';
import socialAuth from './social-auth/social-auth';

async function bootstrap() {
  // Create the app and allow cors and HTTPS support (if configured)
  const app = await NestFactory.create(AppModule, {
    cors: config.CORS_OPTIONS,
    // Will work only if SSH is configured on the related environment config, if not, normal HTTP will be used
    httpsOptions: getHttpsOptionsFromConfig(),
  });

  // Use '/api' for general prefix
  app.setGlobalPrefix('api');

  // Allow validation and transform of params
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Get the express app
  const expressApp = app.getHttpAdapter().getInstance() as express.Application;

  // If we are running on production, mount angular
  if (config.ANGULAR.MOUNT) {
    if (config.ANGULAR.USE_SSR) mountAngularSSR(expressApp);
    else mountAngular(expressApp);
  }

  // Mount social auth to allow it
  socialAuth.init(expressApp);

  // Start listening
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
