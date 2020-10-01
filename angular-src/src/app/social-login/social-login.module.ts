import {
    AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider,
    SocialLoginModule as NgxSocialLogin
} from 'angularx-social-login';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';
import { SocialLoginButtonComponent } from './social-login-button/social-login-button.component';
import { SocialLoginService } from './social-login.service';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.socialLogin.google),
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.socialLogin.facebook),
  },
]);

export function provideConfig(): AuthServiceConfig {
  return config;
}

@NgModule({
  imports: [CommonModule, NgxSocialLogin],
  declarations: [SocialLoginButtonComponent],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
    SocialLoginService,
  ],
  exports: [NgxSocialLogin, SocialLoginButtonComponent],
})
export class SocialLoginModule {}
