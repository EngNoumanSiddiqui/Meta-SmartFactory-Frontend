import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UtilitiesService} from '../utilities.service';
import {Router} from '@angular/router';

@Injectable()
export class LoginControllerService  {

  constructor(private _httpClient: HttpClient, private utilities: UtilitiesService, private _router: Router) {
  }


  getUrl(endpoint: string): string {
    return `${environment.login}${endpoint}`;
  }

  post(endpoint: string, body, options = {}) {
    return this._httpClient.post(this.getUrl(endpoint), body, options).toPromise()
      .then(res => res)
      .catch(err => this.handleError(err));
  }
  handleError(error: any) {
    let message = '';

    console.log(error);
    // console.log(displayError);

    if (error instanceof HttpErrorResponse) {

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
