import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {Subscription, Subject, interval} from 'rxjs';
import * as moment from 'moment';
import {OAuthService} from './oAuth.service';
import {UsersService} from '../users/users.service';
import {DassTokenEnum} from '../../dto/enum/das-token-enum';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class AuthService {

  private authenticated = false;
  private tokenExpirationDate: Date = null;
  private tokenRefreshDate: Date = null;
  private userData: any = null;

  private myInterval = interval(60 * 1000);
  private loginChanged: Subject<boolean> = new Subject();
  
  // @LocalStorage()
  private tokenData: Oauth2TokenData;
  private sessionCheckInterval: Subscription;

  constructor(private _router: Router,
              private _oAuthSvc: OAuthService,
              private _translateSvc: TranslateService,
              private _userSrvc: UsersService) {

    this._translateSvc.use(this._userSrvc.getLanguage());
    this.tokenData = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    // TOKEN Var ise sureyi kontrol edelim yok ise zaten Authenticate degil
    const tExpired = JSON.parse(localStorage.getItem(DassTokenEnum.ACCESS_TOKEN_EXPIRE_KEY));
    const tRefresh = JSON.parse(localStorage.getItem(DassTokenEnum.REFRESH_TOKEN_EXPIRE_KEY));
    if (this.tokenData && this.tokenData.access_token && tExpired && tRefresh) {
      // console.log('has token data and access token.');
      this.authenticated = true;
      this.userData = AuthService.decodeAccessToken(this.tokenData.access_token);
      // console.log(this.userData);

      this.tokenExpirationDate = new Date(tExpired[0], tExpired[1], tExpired[2], tExpired[3], tExpired[4], tExpired[5]);

      this.tokenRefreshDate = new Date(tRefresh[0], tRefresh[1], tRefresh[2], tRefresh[3], tRefresh[4], tRefresh[5]);
      console.log('Token refresh date' + this.tokenRefreshDate);

      if (this.tokenRefreshDate < new Date()) {
        this.logout('SESSION_TIMEOUT');
        this._router.navigate(['/login']);
      } else {
        if (this.tokenExpirationDate < new Date()) {
          this.refreshToken();
        }
        this.checkExpirationDate();
      }

    }

    const x = Date.now();
    localStorage.setItem('b-scheduler-trial-start', '' + x);
  }

  isAuthor(role: string): boolean {
    if (!(role)) {
      return true;
    }

    const authorities = this.userData['authorities'];
    if (authorities && authorities.find(item => item === role)) {
      return true;
    } else {
      return false;
    }
  }


  checkExpirationDate() {
    const me = this;
    this.sessionCheckInterval = this.myInterval.subscribe(() => {
      const tokenSubtractedDate = moment(me.tokenExpirationDate).subtract(2, 'minutes').toDate();
      const now = moment().toDate();
      if (tokenSubtractedDate > now) {
        console.log('not-expired-token');
        console.log('date' + tokenSubtractedDate);
        console.log('now' + now);
      } else {
        this.refreshToken();
      }
      const x = Date.now();
      localStorage.setItem('b-scheduler-trial-start', '' + x);
    });

  }


  disableAuthChecking() {
      this.sessionCheckInterval?.unsubscribe();
      console.log('Disabled Auth Checking');
  }

  enableAuthChecking() {
    console.log('Enabled Auth Checking');
    if (this.tokenRefreshDate < new Date()) {
      this.logout('SESSION_TIMEOUT');
      this._router.navigate(['/login']);
    } else {
      if (this.tokenExpirationDate < new Date()) {
        this.refreshToken();
      }
      this.checkExpirationDate();
    }
  }

  //noinspection TsLint
  public static decodeAccessToken(access_token: string) {
    return JSON.parse(window.atob(access_token.split('.')[1]));
  }

  public isAuthenticated(): boolean {
    // this.checkTokenExpirationDate();
    return this.authenticated;
  }


  // private checkTokenExpirationDate() {
  //   if (this.authenticated && this.tokenExpirationDate < new Date()) {
  //     console.log('Session timeout');
  //     this.logout();
  //   }
  // }

  /** -------------------------------------------------------------------------------------------------------------------
   *  Login Authentication Method
   *  -----------------------------------------------------------------------------------------------------------------**/
  public authenticate(username: string, password: string): Promise<string> {

    this.clearDassLocalStorage();
    console.log(this._translateSvc.instant('authentication-pending'));

    return new Promise<string>((resolve, reject) => {

      if (!username.trim()) {
        reject(this._translateSvc.instant('username-not-blank'));
      }
      if (!password.trim()) {
        reject(this._translateSvc.instant('password-not-blank'));
      }

      const payload = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&grant_type=password';

      this._oAuthSvc.getToken(payload).then((res: Oauth2TokenData) => {

        this.tokenData = res;
        this.authenticated = true;
        this.userData = AuthService.decodeAccessToken(this.tokenData.access_token);

        this.tokenExpirationDate = moment().add(this.tokenData.expires_in, 'seconds').toDate();
        this.tokenRefreshDate = moment().add(this.tokenData.expires_in * 10, 'seconds').toDate();

        // @Note: Adam exploreri kapatirsa localstorage a kayit edelim
        localStorage.setItem(DassTokenEnum.ACCESS_TOKEN_EXPIRE_KEY, JSON.stringify(moment(this.tokenExpirationDate).toArray()));
        localStorage.setItem(DassTokenEnum.REFRESH_TOKEN_EXPIRE_KEY, JSON.stringify(moment(this.tokenRefreshDate).toArray()));

        resolve('OK');

        // Local Storage a token ile ilgili tum biligleri yaziyoruz
        localStorage.setItem(DassTokenEnum.TOKEN_DATA_KEY, JSON.stringify(this.tokenData));

        this.checkExpirationDate();
        this.loginChanged.next(true);

      }).catch(err => {
        // this._toasterSvc.pop('error', JSON.parse(err).error_description);
        reject('Username and password doesn\'t match');
      });
    });
  }

  public refreshToken() {
    console.log('try to refresh  token');
    // if (this.isAuthenticated()) {

    const data = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(this.tokenData.refresh_token);
    this._oAuthSvc.getToken(data)
      .then((res: Oauth2TokenData) => {
        this.tokenData = res;
        this.authenticated = true;
        this.userData = AuthService.decodeAccessToken(this.tokenData.access_token);

        this.tokenExpirationDate = moment().add(this.tokenData.expires_in, 'seconds').toDate();
        this.tokenRefreshDate = moment().add(this.tokenData.expires_in * 10, 'seconds').toDate();

        localStorage.setItem(DassTokenEnum.ACCESS_TOKEN_EXPIRE_KEY, JSON.stringify(moment(this.tokenExpirationDate).toArray()));
        localStorage.setItem(DassTokenEnum.REFRESH_TOKEN_EXPIRE_KEY, JSON.stringify(moment(this.tokenRefreshDate).toArray()));

        localStorage.setItem(DassTokenEnum.TOKEN_DATA_KEY, JSON.stringify(this.tokenData));
        console.log('token refreshed');
      })
      .catch(err => {
        console.log('refresh token is not valid. So local storage cleared')
        this.logout();
        this._router.navigate(['/login']);
      });
    // }
  }

  public clearDassLocalStorage() {
    localStorage.removeItem(DassTokenEnum.ACCESS_TOKEN_EXPIRE_KEY);
    localStorage.removeItem(DassTokenEnum.REFRESH_TOKEN_EXPIRE_KEY);
    localStorage.removeItem('plant');
    localStorage.removeItem(DassTokenEnum.TOKEN_DATA_KEY);
    // this.logout();
  }

  public logout(reason: string = null): any {
    this.authenticated = false;
    this.userData=null;
    console.log('logout: ' + reason);
    this.clearDassLocalStorage();
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
    this.tokenData = null;
    this.loginChanged.next(false);
    // this._router.navigate(['/login']);

  }

  public getUserData(): any {
    console.log(this.userData);
    return this.userData;
  }


}

class Oauth2TokenData {
  access_token: string = null;
  token_type: string = null;
  refresh_token: string = null;
  expires_in: number = null;
  scope: string = null;
  permissions = [];
  fullname: string = null;
  jti: string = null;
  organization: string = null;

  constructor() {
  }
}
