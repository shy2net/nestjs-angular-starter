import { CookieService } from 'ngx-cookie';

import { TestBed, waitForAsync } from '@angular/core/testing';

import { getCommonTestBed } from '../../testing/test_utils';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(waitForAsync(() => {
    getCommonTestBed([]).compileComponents();
    service = TestBed.inject(AuthService);

    const cookieService = TestBed.inject(CookieService);

    // Delete any previous cookie to create clean tests
    cookieService.remove('auth_token');
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial state with no users or credentials stored', () => {
    expect(service.user).toBeUndefined();
    expect(service.loginChecked).toBeFalsy();
    expect(service.hasCredentials).toBeFalsy();
  });

  it('should login with the correct credentials and emit userChanged', async () => {
    // User should be udefined at first
    expect(service.user).toBeUndefined();

    // Expect if userChanged was called
    const spy = spyOn(service.userChanged, 'next');

    await service.login('admin', 'admin').toPromise();

    // Expect that the user was set
    expect(service.user).toBeTruthy();
    expect(service.loginChecked).toBeTruthy();
    expect(service.hasCredentials).toBeTruthy();
    // Expect userChange to be called once
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should have "admin" role and fail on "some" role"', async () => {
    await service.login('admin', 'admin').toPromise();

    expect(service.hasRole('admin')).toBeTruthy();
    expect(service.hasRole('some')).toBeFalsy();
  });

  it('should fail to login with incorrect credentials and userChanged should not be called', async () => {
    const spy = spyOn(service.userChanged, 'next');

    await expectAsync(
      service.login('incorrect', 'incorrect').toPromise()
    ).toBeRejected();

    // User should be undefined and no userChanged should be called
    expect(service.user).toBeUndefined();
    expect(service.hasCredentials).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
