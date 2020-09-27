/*
Credits to:
https://bcodes.io/blog/post/angular-universal-relative-to-absolute-http-interceptor
for this great code!
*/

import { Request } from 'express';
import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';

// case insensitive check against config and value
const startsWithAny = (arr: string[] = []) => (value = '') => {
  return arr.some((test) => value.toLowerCase().startsWith(test.toLowerCase()));
};

// http, https, protocol relative
const isAbsoluteURL = startsWithAny(['http', '//']);

@Injectable()
export class UniversalRelativeInterceptor implements HttpInterceptor {
  constructor(@Optional() @Inject(REQUEST) protected request: Request) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.request && !isAbsoluteURL(req.url)) {
      const protocolHost = `${this.request.protocol}://${this.request.get(
        'host'
      )}`;
      const pathSeparator = !req.url.startsWith('/') ? '/' : '';
      const url = protocolHost + pathSeparator + req.url;
      const serverRequest = req.clone({ url });
      return next.handle(serverRequest);
    } else {
      return next.handle(req);
    }
  }
}
