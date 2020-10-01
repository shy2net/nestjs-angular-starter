import { Observable, of, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { UserProfile } from '../../../../../shared/models';
import { LoginResponse } from '../../../../../shared/models/login-response';
import { generateMockRootUser } from '../../../../../shared/testing/mock/user.mock';

@Injectable()
export class MockApiService {
  // The root user
  rootUser: UserProfile = generateMockRootUser();

  // The list of users registered
  registeredUsers: UserProfile[] = [];

  login(username: string, password: string): Observable<LoginResponse> {
    if (username === 'admin' && password === 'admin') {
      return of({
        token: 'randomtoken',
        user: this.rootUser,
      });
    }

    // All other requests should return an error
    return throwError({
      status: 'error',
      error: 'Invalid username\\password entered!',
    });
  }

  socialLogin(): Observable<LoginResponse> {
    return throwError('Not implemented!');
  }

  register(user: UserProfile): Observable<UserProfile> {
    this.registeredUsers.push(user);
    return of(user);
  }

  getProfile(): Observable<UserProfile> {
    return of(this.rootUser);
  }
}
