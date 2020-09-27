import { Component } from '@angular/core';

import { SocialLoginService } from '../social-login.service';

@Component({
  selector: 'app-social-login-button',
  templateUrl: './social-login-button.component.html',
  styleUrls: ['./social-login-button.component.css'],
})
export class SocialLoginButtonComponent {
  constructor(private socialLoginService: SocialLoginService) {}

  onSocialLoginClick(provider: string): Promise<void> {
    return this.socialLoginService.signIn(provider);
  }
}
