import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import { AppService } from '../../core/services/app.service';
import { getCommonTestBed } from '../../testing/test_utils';
import { UserPageComponent } from './user-page.component';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let appService: AppService;
  let fixture: ComponentFixture<UserPageComponent>;
  let htmlElement: HTMLElement;

  let heading: HTMLElement;

  beforeEach(waitForAsync(() => {
    getCommonTestBed([UserPageComponent], []).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appService = TestBed.inject(AppService);
    htmlElement = fixture.debugElement.nativeElement;
    heading = htmlElement.querySelector('.jumbotron-heading');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct user email', fakeAsync(() => {
    // Create a mock user with the email we expect to receive when the user is connected
    spyOnProperty(appService, 'user').and.returnValue({
      email: 'fake@mail.com',
    });

    fixture.detectChanges();
    expect(heading.textContent).toEqual('Hello there fake@mail.com');
  }));
});
