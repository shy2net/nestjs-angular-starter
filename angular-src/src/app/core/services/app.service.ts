import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import { UserProfile } from '../../../../../shared/models';
import { AuthService } from './auth.service';

@Injectable()
export class AppService {
  isRequestLoading = false;

  get user(): UserProfile {
    return this.authService.user;
  }

  get userChanged(): BehaviorSubject<UserProfile> {
    return this.authService.userChanged;
  }

  get isLoggedIn(): boolean {
    return this.user != null && this.loginChecked;
  }

  get loginChecked(): boolean {
    return this.authService.loginChecked;
  }

  constructor(public authService: AuthService) {}
}
