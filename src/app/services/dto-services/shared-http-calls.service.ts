import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { UtilitiesService } from '../utilities.service';
import { Router } from '@angular/router';

import { catchError, map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ShareHttpCallsService {
    private pending = new Map<string, any>();
    private reqBody = new Map<string, any>();
    constructor(private httpClient: HttpClient,  private utilities: UtilitiesService, private _router: Router) {

      setInterval(() => {
        this.pending.clear();
        this.reqBody.clear();
      }, 30 * 60 * 1000)

    }
    private getUrl(endpoint: string): string {
        return `${environment.host}${endpoint}`;
    }
    get(endpoint: string, options = {}): Observable<any> {
        return Observable.create((observer) => {
            // console.log(this.pending);
            const pendingRequestObservable = this.pending.get(endpoint);
          if (pendingRequestObservable) {
            observer.next(pendingRequestObservable);
            observer.complete();
          } else if (this.pending.has(endpoint) && !this.pending.get(endpoint)) {
            const me = this;
            const inteval = setInterval(() => {
              if (this.pending.has(endpoint)) {
                if (me.pending.get(endpoint)) {
                  observer.next(me.pending.get(endpoint));
                  observer.complete();
                  clearInterval(inteval);
                }
              } else {
                clearInterval(inteval);
              }
            }, 2000);
          } else { /* make http request & process */
            this.pending.set(endpoint, null);
            this.httpClient.get(this.getUrl(endpoint), options)
            .pipe(map(res => res), catchError(err => this.handleObservableError(err)))
            .subscribe(res => {
              this.pending.set(endpoint, res); /* Save response for future */
              observer.next(this.pending.get(endpoint));
              observer.complete();
            }, err => {
              this.pending.delete(endpoint);
            }); /* please make sure to handle http error */
          }
        });
    }


    post( endpoint: string, body, options = {}, skipCache: boolean = false ): Observable<any> {
      return Observable.create((observer) => {
          // console.log(this.pending);
          const pendingRequestObservable = this.pending.get(endpoint);
          const requestBodyObservable = this.reqBody.get(endpoint);
        if ( !skipCache && pendingRequestObservable && JSON.stringify(body) === requestBodyObservable) {
          observer.next(pendingRequestObservable);
          observer.complete();
        } else if ( !skipCache && this.pending.has(endpoint) && !this.pending.get(endpoint)) {
          const me = this;
          const inteval = setInterval(() => {
            if (this.pending.has(endpoint)) {
              if (me.pending.get(endpoint)) {
                observer.next(me.pending.get(endpoint));
                observer.complete();
                clearInterval(inteval);
              }
            } else {
              clearInterval(inteval);
            }
          }, 2000);
        } else { /* make http request & process */
          this.pending.set(endpoint, null);
          this.reqBody.set(endpoint, JSON.stringify(body));
          this.httpClient.post(this.getUrl(endpoint), body, options)
          .pipe(map(res => res), catchError(err => this.handleObservableError(err)))
          .subscribe(res => {
            this.pending.set(endpoint, res); /* Save response for future */
            // this.reqBody.set(endpoint, JSON.stringify(body));
            observer.next(this.pending.get(endpoint));
            observer.complete();
          } , err => this.pending.delete(endpoint)); /* please make sure to handle http error */
        }
      });
    }

    handleObservableError(error) {


      let message = '';
      if (error instanceof HttpErrorResponse) {

        switch (error.status) {
          case 200: // OK
          case 201: // Created
          case 202: // Accepted
            message = error.message;
            break;

          case 400: // Bad Request
            message = 'BAD_REQUEST';
            break;
          case 401: // Unauthorized
                    // localStorage.removeItem('dassTokenData');
            this._router.navigate(['/login']);
            break;
          case 403: // Forbidden
          case 404: // Not Found
            if ((error.error)
              && (error.error.errorCode)) {
              message = error.error.errorCode;
            } else if ((error.error)) {
              message = JSON.stringify(error.error);
            } else {
              message = JSON.stringify(error);
            }
            break;
          case 405: // Method Not Allowed
          case 406: // Not Acceptable
          case 408: // Request Timeout

            message = JSON.stringify(error.error);
            break;
          case 0: // Request Timeout
            message = 'CONNECTION-ERROR';
            break
          default:
            message = JSON.stringify(error);
            break;
        }

      }

      this.utilities.showErrorToast(message);
      return of({totalPages: 0, totalElements: 0, content: []});
    }
}
