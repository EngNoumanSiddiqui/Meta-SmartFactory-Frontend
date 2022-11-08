import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {UtilitiesService} from '../utilities.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {IToastButton} from '../../shared/custom-toast-component/custom-toast.component';
import {AppStateService} from '../dto-services/app-state.service';

@Injectable()
export class HttpControllerService {

  constructor(
    private appState: AppStateService,
    private _httpClient: HttpClient,
    private utilities: UtilitiesService,
    private _router: Router
  ) {
  }

  getUrl(endpoint: string): string {
    return `${environment.host}${endpoint}`;
  }

  get(endpoint: string, options = {}) {
    return this._httpClient.get(this.getUrl(endpoint), options).toPromise()
      .then(res => res)
      .catch(err => this.handleError(err, {
        endpoint: this.getUrl( endpoint ),
        options,
      }));
  }

  post(endpoint: string, body, options = {}) {
    return this._httpClient.post(this.getUrl(endpoint), body, options).toPromise()
      .then(res => res)
      .catch(err => this.handleError(err, {
        endpoint: this.getUrl( endpoint ),
        body,
        options,
      }));
  }

  put(endpoint: string, body, options = {}) {
    return this._httpClient.put(this.getUrl(endpoint), body, options).toPromise()
      .then(res => res)
      .catch(err => this.handleError(err, {
        endpoint: this.getUrl( endpoint ),
        body,
        options,
      }));
  }

  delete(endpoint: string, options = {}) {
    return this._httpClient.delete(this.getUrl(endpoint), options).toPromise()
      .then(res => res)
      .catch(err => this.handleError(err, {
        endpoint: this.getUrl( endpoint ),
        options,
      }));
  }

  postObservable(endpoint: string, body, options = {}): Observable<any> {
    return this._httpClient.post(this.getUrl(endpoint), body, options).pipe(map(res => res),
      catchError(err => this.handleObservableError(err, {
        endpoint: this.getUrl( endpoint ),
        body,
        options,
      })));
  }
  getObservable(endpoint: string, options = {}): Observable<any> {
    return this._httpClient.get(this.getUrl(endpoint), options)
    .pipe(
      map(res => res),
      catchError(err => this.handleObservableError(err, {
        endpoint: this.getUrl( endpoint ),
        options,
      }))
    );
  }

  handleObservableError(error, data?: any) {


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
          } else if (error.error) {
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


      const actionButtons: IToastButton[] = [
        {
          id: 'copy',
          title: 'copy',
          action: () => {
            this.appState.copyToClipBoard(data);
            this.utilities.showSuccessToast('Copied to clip board');
          }
        },
        {
          id: 'save',
          title: 'save',
          action: () => {
            const file = prompt('Enter File name');
            this.appState.saveTextAsFile( data, file);
          }
        },
      ];

      switch ( error.status ) {

        case 400: // Bad Request
        case 401: // Unauthorized
        case 402:
        case 403: // Forbidden
        case 404: // Not Found
        case 405: // Method Not Allowed
        case 406: // Not Acceptable
        case 408: // Request Timeout
        case 500: // Request Timeout
          this.utilities.showActionErrorToast( message, actionButtons );
          return of({totalPages: 0, totalElements: 0, content: []});
          break;
      }

    }

    this.utilities.showErrorToast(message);
    return of({totalPages: 0, totalElements: 0, content: []});
  }

// might not work correctly cause the errors are not unified on backend
  handleError(error: any, data?: any) {
    let message = '';

    console.log(error);
    // console.log(displayError);

    if (error instanceof HttpErrorResponse) {


      switch ( error.status ) {

        case 400: // Bad Request
        case 401: // Unauthorized
        case 402:
        case 403: // Forbidden
        case 404: // Not Found
        case 405: // Method Not Allowed
        case 406: // Not Acceptable
        case 408: // Request Timeout
        case 500: // Request Timeout
          // TO save request json if user decides to copy or save
          this.utilities.lastErrorRequest = data;
          break;
      }



      switch (error.status) {
        case 200: // OK
        case 201: // Created
        case 202: // Accepted
          message = error.message;
          return Promise.resolve(error.message);

        case 401: // Unauthorized
          // localStorage.removeItem('dassTokenData');
          this._router.navigate(['/login']);
          return Promise.reject('UNAUTHORIZED_OR_LOGIN_EXPIRE');
        case 400: // Bad Request
        case 403: // Forbidden
        case 404: // Not Found
          if ((error.error)
            && (error.error.errorCode)) {
            return Promise.reject(error.error.errorCode);
          } else if (error.error) {
            return Promise.reject(JSON.stringify(error.error));
          } else {
            return Promise.reject(JSON.stringify(error));
          }
        case 405: // Method Not Allowed
        case 406: // Not Acceptable
        case 408: // Request Timeout

          return Promise.reject(error.error);

        case 0: // Request Timeout
          return Promise.reject('CONNECTION-ERROR');
        default:
          return Promise.reject(error.error);
      }

    }
  }
}

