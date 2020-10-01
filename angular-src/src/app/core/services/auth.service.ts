import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LoginResponse, UserProfile } from '../../../../../shared/models';
import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  _user: UserProfile;
  userChanged: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>(
    null,
  );
  private _loginChecked: boolean;

  get user(): UserProfile {
    return this._user;
  }

  set user(user: UserProfile) {
    if (user !== this._user) {
      if (user !== null) {
        this.loginChecked = true;
      }

      this._user = user;
      this.userChanged.next(user);
    }
  }

  get loginChecked(): boolean {
    return this._loginChecked;
  }

  set loginChecked(loginChecked: boolean) {
    this._loginChecked = loginChecked;
  }

  get hasCredentials(): boolean {
    return !!this.savedToken;
  }

  get savedToken(): string {
    return this.cookieService.get('auth_token');
  }

  get isLoggedIn(): boolean {
    return this.hasCredentials && !!this._user;
  }

  get isLoggedInAsync(): Observable<boolean> | boolean {
    if (!this.hasCredentials) {
      return false;
    }

    if (!this.loginChecked) {
      return this.checkLogin().pipe(map(user => !!user));
    }

    return this.isLoggedIn;
  }

  /**
   * Checks if a user has a specific role.
   * @param roleName
   * @param user If not specified, will use the local authenticated user.
   */
  hasRole(roleName: string, user?: UserProfile): string {
    if (!user) user = this._user;
    return user.roles.find(role => roleName === role);
  }

  /**
   * Checks if a user has specific roles.
   * @param roles The roles to check if exists
   * @param user If not specified, will use the local authenticated user.
   */
  hasRoles(roles: string[], user?: UserProfile): boolean {
    for (const role of roles) {
      if (!this.hasRole(role, user)) return false;
    }

    return true;
  }

  hasRolesAsync(roles: string[]): boolean | Observable<boolean> {
    if (this.isLoggedIn) return this.hasRoles(roles);

    if (!this.loginChecked) {
      return this.checkLogin().pipe(map(user => this.hasRoles(roles, user)));
    }

    return false;
  }

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
  ) {}

  checkLogin(): Observable<UserProfile> {
    if (!this.hasCredentials) {
      this.loginChecked = true;
      return;
    }

    this.loginChecked = false;
    return this.apiService.getProfile().pipe(
      tap(
        response => {
          this.loginChecked = true;
          this.user = response;
        },
        () => {
          this.loginChecked = true;
        },
      ),
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.login(email, password).pipe(
      tap(
        result => {
          this.cookieService.put(`auth_token`, result.token);
          this.user = result.user;
        },
        error => {
          this.userChanged.error(error);
          console.error(error);
        },
      ),
    );
  }

  /**
   * Signs into using the social authentication credentails provided.
   * @param provider
   * @param authToken
   */
  socialLogin(provider: string, authToken: string): Promise<UserProfile> {
    return this.apiService
      .socialLogin(provider, authToken)
      .toPromise()
      .then(result => {
        this.cookieService.put(`auth_token`, result.token);
        this.user = result.user;
        return this.user;
      })
      .catch(error => {
        this.userChanged.error(error);
        return error;
      });
  }

  logout(): Promise<void> {
    this.user = null;
    this.cookieService.remove('auth_token');
    this.loginChecked = true;

    // We return a promise so we can notify that everything went well (add your own logout logic if required)
    return Promise.resolve(null);
  }
}
