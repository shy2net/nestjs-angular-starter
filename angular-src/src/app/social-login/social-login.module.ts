import {
    FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig,
    SocialLoginModule as NgxSocialLogin
} from 'angularx-social-login';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';
import { SocialLoginButtonComponent } from './social-login-button/social-login-button.component';
import { SocialLoginService } from './social-login.service';

const config: SocialAuthServiceConfig = {
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.socialLogin.google),
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.socialLogin.facebook),
    },
  ],
};

export function provideConfig(): SocialAuthServiceConfig {
  return config;
}

@NgModule({
  imports: [CommonModule, NgxSocialLogin],
  declarations: [SocialLoginButtonComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useFactory: provideConfig,
    },
    SocialLoginService,
  ],
  exports: [NgxSocialLogin, SocialLoginButtonComponent],
})
export class SocialLoginModule {}
