import { ToastrService } from 'ngx-toastr';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserProfileModel } from '../../../../../shared/models/user-profile.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userProfile: UserProfileModel = new UserProfileModel();
  isFormValid: boolean;

  constructor(
    private apiService: ApiService,
    private toastyService: ToastrService,
    private router: Router
  ) {}

  onFormValidChange(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  onRegisterClick(): void {
    this.apiService.register(this.userProfile).subscribe(() => {
      this.toastyService.success(
        `User successfully registered! please login now`
      );
      this.router.navigateByUrl('/login');
    });
  }
}
