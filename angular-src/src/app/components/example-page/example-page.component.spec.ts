import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplePageComponent } from './example-page.component';

describe('ExamplePageComponent', () => {
  let component: ExamplePageComponent;
  let fixture: ComponentFixture<ExamplePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamplePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
