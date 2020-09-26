import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SocialAuthController } from './social-auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [SocialAuthController],
})
export class SocialAuthModule {}
