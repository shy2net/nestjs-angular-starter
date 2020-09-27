import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { UniversalRelativeInterceptor } from '@core/universal-relative.interceptor';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [AppModule, ServerModule, NoopAnimationsModule, ServerTransferStateModule],
  providers: [
    // Add server-only providers here.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalRelativeInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
