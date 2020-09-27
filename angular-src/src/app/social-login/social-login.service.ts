import {
    AuthService as SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser
} from 'angularx-social-login';
import { Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { AuthService } from '@services';

import { UserProfile } from '../../../../shared/models';

@Injectable()
export class SocialLoginService {
  loginStateChanged: Subject<UserProfile> = new Subject<UserProfile>();

  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService
  ) {}

  signIn(provider: string): Promise<void> {
    return this.signInByProvider(provider)
      .then((socialUser) => {
        if (socialUser) {
          const authToken = socialUser.authToken;

          // After the social login succeded, signout from the social service
          this.authService
            .socialLogin(provider, authToken)
            .then((result) => {
              this.socialAuthService.signOut().then(() => {
                this.loginStateChanged.next(result);
              });
            })
            .catch((error) => {
              this.loginStateChanged.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        this.loginStateChanged.error(error);
      });
  }

  private signInByProvider(provider: string): Promise<SocialUser> {
    switch (provider) {
      case 'google':
        return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      case 'facebook':
        return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }
}
