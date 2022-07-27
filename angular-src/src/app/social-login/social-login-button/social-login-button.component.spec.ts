import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { getCommonTestBed } from '../../testing/test_utils';
import { SocialLoginModule } from '../social-login.module';
import { SocialLoginButtonComponent } from './social-login-button.component';

describe('SocialLoginButtonComponent', () => {
  let component: SocialLoginButtonComponent;
  let fixture: ComponentFixture<SocialLoginButtonComponent>;

  beforeEach(waitForAsync(() => {
    getCommonTestBed([SocialLoginButtonComponent], [SocialLoginModule]).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SocialLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
