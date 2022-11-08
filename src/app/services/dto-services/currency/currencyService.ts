/**
 * Created by reis on 11.06.2019.
 */
import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class CurrencyService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  detail(id: string) { return this._httpSvc.get('currency/detail/' + id, this._opt.getHeader()); }


  delete(id: string) { return this._httpSvc.get('currency/cancel/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('currency/save', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('currency/filter', data, this._opt.getHeader()); }

}
