import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { getCommonTestBed } from '../../testing/test_utils';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let htmlElement: HTMLElement;
  let fixture: ComponentFixture<LoginComponent>;

  let userInput: HTMLInputElement;
  let passInput: HTMLInputElement;
  let loginBtn: HTMLInputElement;

  const setUsernamePasswordInput = (username: string, password: string) => {
    userInput.value = username;
    userInput.dispatchEvent(new Event('input'));

    passInput.value = password;
    passInput.dispatchEvent(new Event('input'));
  };

  beforeEach(async(() => {
    getCommonTestBed([LoginComponent], [FormsModule]).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    htmlElement = fixture.debugElement.nativeElement;
    userInput = htmlElement.querySelector('input[name=email]');
    passInput = htmlElement.querySelector('input[name=password]');
    loginBtn = htmlElement.querySelector('#login_btn');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login should be disabled', () => {
    const expectLoginDisabled = () => {
      expect(loginBtn.disabled).toBeTruthy();
    };

    setUsernamePasswordInput('username', '');
    fixture.detectChanges();
    expectLoginDisabled();

    setUsernamePasswordInput('', 'password');
    fixture.detectChanges();
    expectLoginDisabled();

    setUsernamePasswordInput('', '');
    fixture.detectChanges();
    expectLoginDisabled();
  });

  it('should set username & password, login should be enabled', () => {
    fixture.detectChanges();
    const username = 'my_random_user';
    const password = 'my_password';

    // Set the input username and password
    setUsernamePasswordInput(username, password);
    fixture.detectChanges();

    expect(component.email).toEqual(username);
    expect(component.password).toEqual(password);
    expect(loginBtn.disabled).toBeFalsy();
  });
});
