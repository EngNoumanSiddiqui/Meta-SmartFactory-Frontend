import { Injectable } from '@angular/core';
import { BasePageService } from '../base/base-page.service';
import { LoginControllerService } from '../core/login-controller.service';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class OAuthService extends BasePageService {
  constructor(private httpSvc: LoginControllerService) {
    super();
  }

getToken(data) {
    const basicAuthHeader = btoa(`betex:secret`);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .append('Authorization', `Basic ${basicAuthHeader}`)
    };
    return this.httpSvc.post('oauth/token', data, options);
  }
}
