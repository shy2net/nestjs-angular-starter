import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { getCommonTestBed } from '../../testing/test_utils';
import { SocialLoginModule } from '../social-login.module';
import { SocialLoginButtonComponent } from './social-login-button.component';

describe('SocialLoginButtonComponent', () => {
  let component: SocialLoginButtonComponent;
  let fixture: ComponentFixture<SocialLoginButtonComponent>;

  beforeEach(async(() => {
    getCommonTestBed([SocialLoginButtonComponent], [SocialLoginModule]).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SocialLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
