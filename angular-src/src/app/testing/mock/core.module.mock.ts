import { SocialLoginModule } from 'angularx-social-login';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppHttpInterceptor } from '@core/app-http.interceptor';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ApiService, AppService, AuthGuardService, AuthService, RequestsService } from '@services';
import { SharedModule } from '@shared/shared.module';

import { MockApiService } from './api.service.mock';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    LoadingBarModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    }),
    SharedModule,
    SocialLoginModule,
    RouterTestingModule,
  ],
  declarations: [HeaderComponent, FooterComponent],
  providers: [
    {
      useClass: MockApiService,
      provide: ApiService,
    },
    AuthService,
    AuthGuardService,
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    RequestsService,
  ],
  exports: [HeaderComponent, FooterComponent, LoadingBarModule, ToastrModule, SocialLoginModule],
})
export class MockCoreModule {}
