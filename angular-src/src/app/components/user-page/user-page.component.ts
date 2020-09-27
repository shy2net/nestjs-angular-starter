import { ToastrService } from 'ngx-toastr';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserProfile } from '../../../../../shared/models/user-profile';
import { AppService, AuthService } from '../../core/services';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent {
  constructor(
    private router: Router,
    private appService: AppService,
    private toastService: ToastrService,
    private authService: AuthService
  ) {}

  get user(): UserProfile {
    return this.appService.user;
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/');
      this.toastService.success(
        `You are logged out`,
        `You have succesfully logged out!`
      );
    });
  }
}
