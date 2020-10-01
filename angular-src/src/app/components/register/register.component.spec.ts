import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import {
    getCommonTestBed, getInputElementValidationDiv, setInputValueWithEvent, tickAndDetectChanges
} from '../../testing/test_utils';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let htmlElement: HTMLElement;

  let emailField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let firstNameField: HTMLInputElement;
  let lastNameField: HTMLInputElement;
  let registerButton: HTMLInputElement;

  // const getAllTextInputFields = (): Array<HTMLInputElement> => {
  //   return Array.apply(
  //     null,
  //     htmlElement.querySelectorAll('input[type="text"] input[type="password"]')
  //   );
  // };

  const anyFieldHasInvalidDescription = () => {
    return document.querySelector('.invalid-feedback');
  };

  const fieldHasInvalidDescription = (field: HTMLInputElement) => {
    return getInputElementValidationDiv(field).classList.contains(
      'invalid-feedback'
    );
  };

  beforeEach(async(() => {
    getCommonTestBed([RegisterComponent], [FormsModule]).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    htmlElement = fixture.debugElement.nativeElement;
    emailField = htmlElement.querySelector('#email');
    passwordField = htmlElement.querySelector('#password');
    firstNameField = htmlElement.querySelector('#firstName');
    lastNameField = htmlElement.querySelector('#lastName');
    registerButton = htmlElement.querySelector('button[type="submit"]');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register button be disabled', () => {
    // By default the register button should be disabled as no data is presented
    expect(registerButton.disabled).toBeTruthy();
  });

  it('should render email field validation correctly', fakeAsync(() => {
    // By default email is empty and should have an invalid description
    expect(fieldHasInvalidDescription(emailField)).toBeTruthy();

    // Enter a valid email
    setInputValueWithEvent(emailField, 'test@mail.com');
    tickAndDetectChanges(fixture);

    // Email should now be valid
    expect(fieldHasInvalidDescription(emailField)).toBeFalsy();

    // Now enter an invalid email address
    setInputValueWithEvent(emailField, 'someinvalidmailaddress');
    tickAndDetectChanges(fixture);

    // Now check to see that the error is rendered
    expect(fieldHasInvalidDescription(emailField)).toBeTruthy();
  }));

  it('should render password validation correctly', fakeAsync(() => {
    // By default password is empty and should have an invalid description
    expect(fieldHasInvalidDescription(passwordField)).toBeTruthy();

    // Enter a valid password
    setInputValueWithEvent(passwordField, 'thisisavalidpassword');
    tickAndDetectChanges(fixture);

    // Password should now be valid
    expect(fieldHasInvalidDescription(passwordField)).toBeFalsy();

    // Set an invalid short password
    setInputValueWithEvent(passwordField, 'short');
    tickAndDetectChanges(fixture);

    // Now check to see that error is rendered
    expect(fieldHasInvalidDescription(passwordField)).toBeTruthy();
  }));

  it('should render first name & last name field validation correctly', fakeAsync(() => {
    const checkFirstOrLastNameField = (field: HTMLInputElement) => {
      // By default first\last field is empty and should have an invalid description
      expect(fieldHasInvalidDescription(field)).toBeTruthy();

      // Enter a valid input
      setInputValueWithEvent(field, 'generic name');
      tickAndDetectChanges(fixture);

      // Field should now be valid
      expect(fieldHasInvalidDescription(field)).toBeFalsy();

      // Set an invalid first\last name field
      setInputValueWithEvent(field, '');
      tickAndDetectChanges(fixture);

      // Now check to see that error is rendered
      expect(fieldHasInvalidDescription(field)).toBeTruthy();
    };

    checkFirstOrLastNameField(firstNameField);
    checkFirstOrLastNameField(lastNameField);
  }));

  it('should fill all fields, register button be enabled and no errors should render', fakeAsync(() => {
    setInputValueWithEvent(emailField, 'test@mai.com');
    setInputValueWithEvent(passwordField, 'password');
    setInputValueWithEvent(firstNameField, 'first');
    setInputValueWithEvent(lastNameField, 'last');

    tickAndDetectChanges(fixture);

    expect(anyFieldHasInvalidDescription()).toBeFalsy();
    expect(registerButton.disabled).toBeFalsy();
  }));
});
