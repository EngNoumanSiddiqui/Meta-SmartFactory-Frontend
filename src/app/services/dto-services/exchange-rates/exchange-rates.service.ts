/**
 * Created by reis on 11.06.2019.
 */
 import { Injectable } from '@angular/core';
 import { BasePageService } from '../../base/base-page.service';
 import { HttpControllerService } from '../../core/http-controller.service';
 import { OptionService } from '../../base/option-service';
 
 @Injectable()
 export class ExchangeRateService extends BasePageService {
   constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
     super();
   }
 
   detail(id: string) { return this._httpSvc.get('currency/record/detail/' + id, this._opt.getHeader()); }
   delete(id: string) { return this._httpSvc.delete('currency/record/delete/' + id, this._opt.getHeader()); }
   save(data) { return this._httpSvc.post('currency/record/save', data, this._opt.getHeader()); }
   filterObservable(data) { return this._httpSvc.postObservable('currency/record/filter', data, this._opt.getHeader()); }
 
 }
 