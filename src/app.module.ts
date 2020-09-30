import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import config from './config';
import { ApiController } from './controllers/api.controller';
import { DatabaseModule } from './database/database.module';
import { SocialAuthServices } from './social-auth/social-auth.models';
import { SocialAuthModule } from './social-auth/social-auth.module';

@Module({
  imports: [
    DatabaseModule.withConfig({ uri: config.DB_URI }),
    AuthModule,
    SocialAuthModule.withConfig({
      socialAuthServices: config.SOCIAL_CREDENTIALS as SocialAuthServices,
    }),
  ],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}
