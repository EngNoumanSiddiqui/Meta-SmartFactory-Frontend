import {Injectable} from '@angular/core';
import {BasePageService} from '../base/base-page.service';
import {HttpParams} from '@angular/common/http';
import {HttpControllerService} from '../core/http-controller.service';

@Injectable()
export class UsersService extends BasePageService {

  constructor(private _httpController: HttpControllerService ) {
    super();
  }

  loginLog() { this._httpController.get('users/loginLog'); }

  logoutLog(reason: string) {
    const options = { params: new HttpParams().set('reason', reason) };
    return this._httpController.get('users/logoutLog', options);
  }

  /** ----------------------------------------------------------------------------
   * set current users Language
   -----------------------------------------------------------------------------*/
 public setLanguage(languageCode: string) {
    localStorage.setItem('language', languageCode)
  }

  /** ----------------------------------------------------------------------------
   * get current users Language
   * @returns {any}
   -----------------------------------------------------------------------------*/
  public getLanguage() {
    if (localStorage.getItem('language') !== null ) {
      return localStorage.getItem('language');
    } else { return null; }
  }

  /** ----------------------------------------------------------------------------
   * set current users Organization
   -----------------------------------------------------------------------------*/
  public setOrganization(organization:any) {
    localStorage.setItem('organization', JSON.stringify(organization));
  }
  /** ----------------------------------------------------------------------------
   * get current users Organization
   -----------------------------------------------------------------------------*/
   public getOrganization() {
    if (localStorage.getItem('organization') !== null ) {
      return localStorage.getItem('organization');
    } else { return null; }
  }
  /** ----------------------------------------------------------------------------
   * Remove current users Organization
   -----------------------------------------------------------------------------*/
   public removeOrganization() {
    localStorage.removeItem('organization');
  }

  /** ----------------------------------------------------------------------------
   * set current users Plant
   -----------------------------------------------------------------------------*/
 public setPlant(plantInfo:any) {
  localStorage.setItem('plant', JSON.stringify(plantInfo));
  }

public removePlant() {
  localStorage.removeItem('plant');
}

/** ----------------------------------------------------------------------------
 * get current users select Plant
 * @returns {any}
 -----------------------------------------------------------------------------*/
public getPlant() {
  if (localStorage.getItem('plant') !== null ) {
    return localStorage.getItem('plant');
  } else { return null; }
}


}
