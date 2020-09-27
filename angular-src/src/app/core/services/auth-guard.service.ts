import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(public router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    return this.checkAuthentication(route.data && route.data['roles']);
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    return this.checkAuthentication(route.data && route.data['roles']);
  }

  checkAuthentication(roles?: string[]): boolean | Observable<boolean> {
    if (roles) {
      return this.authService.hasRolesAsync(roles);
    }

    return this.authService.isLoggedInAsync;
  }
}
