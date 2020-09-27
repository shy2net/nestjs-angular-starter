import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get('/') as Promise<unknown>;
  }

  getParagraphText(): Promise<string> {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }
}
