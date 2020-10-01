import { DynamicModule, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SocialAuthController } from './social-auth.controller';
import { SocialAuthModuleConfig } from './social-auth.models';
import { SocialAuthService } from './social-auth.service';

/**
 * Responsible of initializing 3rd party social authentication such as
 * Google and Facebook. Relies on passport for the authentication process.
 */
@Module({
  imports: [AuthModule],
  controllers: [SocialAuthController],
  providers: [SocialAuthService],
})
export class SocialAuthModule {
  static register(config: SocialAuthModuleConfig): DynamicModule {
    return {
      module: SocialAuthModule,
      providers: [{ provide: 'SOCIAL_AUTH_MODULE_CONFIG', useValue: config }],
    };
  }
}
