import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class LoginRecordsService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  filterObservable( data ) { return this._httpSvc.postObservable('workstationOperator/filter', data , this._opt.getHeader() ); }
  filter( data ) { return this._httpSvc.post('workstationOperator/filter', data , this._opt.getHeader() ); }

  login(data) { return this._httpSvc.post('workstationOperator/login', data, this._opt.getHeader()); }

  logout(data) { return this._httpSvc.post('workstationOperator/logout', data, this._opt.getHeader()); }
}

