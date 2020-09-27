import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';

export enum RequestState {
  started,
  ended,
}

/**
 * An error generated from the server.
 */
interface ServerErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

/**
 * Handles all of the ongoing requests state, which allows us to detect whether a request is currently happening in the background or not.
 * You can use this service to create an app request loading bar (in the header for example).
 */
@Injectable()
export class RequestsService {
  private requestsCount = 0;

  @Input()
  disableErrorToast = false;
  onRequestStateChanged: Subject<RequestState> = new Subject<RequestState>();

  get isRequestLoading(): boolean {
    return this.requestsCount > 0;
  }

  constructor(private toastService: ToastrService) {}

  onRequestStarted(
    request: Observable<HttpEvent<unknown>>,
  ): Observable<HttpEvent<unknown>> {
    // If we have detected that no previous request is running, emit and event that a request is ongoing now
    if (!this.isRequestLoading) {
      this.onRequestStateChanged.next(RequestState.started);
    }

    // Add the request to the count
    ++this.requestsCount;

    // Handle the request data obtained and show an error toast if nessecary
    return request.pipe(
      tap(
        (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            this.onRequestEnded();
          }
        },
        errorResponse => {
          if (errorResponse instanceof HttpErrorResponse) {
            if (!this.disableErrorToast) {
              const errorBody = errorResponse.error as ServerErrorResponse;
              this.toastService.error(
                `An error had occurred`,
                errorBody.message,
              );
            }

            this.onRequestEnded();
          }
        },
      ),
    );
  }

  private onRequestEnded(): void {
    if (--this.requestsCount === 0) {
      this.onRequestStateChanged.next(RequestState.ended);
    }
  }
}
