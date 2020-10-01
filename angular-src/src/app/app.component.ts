import { isPlatformBrowser } from '@angular/common';
import { APP_ID, Component, Inject, PLATFORM_ID } from '@angular/core';
import {
    Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router
} from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AppService } from '@services';

// Quick hack, because importing jquery with bootstrap makes issues with SSR, we use this alternative
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private loadingBarService: LoadingBarService,
    public appService: AppService,
    @Inject(PLATFORM_ID) private platformId: unknown,
    @Inject(APP_ID) private appId: string,
  ) {
    if (isPlatformBrowser(platformId))
      this.router.events.subscribe(this.navigationInterceptor.bind(this));
  }

  private isAppLoading = false;

  get isLoading(): boolean {
    return this.isAppLoading;
  }
  set isLoading(newValue: boolean) {
    if (newValue) {
      this.loadingBarService.start();
    } else {
      this.loadingBarService.complete();
    }

    this.isAppLoading = newValue;
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.isLoading = true;

      // Toogle navbar collapse when clicking on link
      const navbarCollapse = $('.navbar-collapse');
      if (navbarCollapse != null) {
        navbarCollapse.collapse('hide');
      }
    }
    if (event instanceof NavigationEnd) {
      this.isLoading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.isLoading = false;
    }
    if (event instanceof NavigationError) {
      this.isLoading = false;
    }
  }
}
