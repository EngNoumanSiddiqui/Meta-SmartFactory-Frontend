/**
 * Created by reis on 30.07.2019.
 */
 import { Injectable } from '@angular/core';
 import { BasePageService} from '../../base/base-page.service';
 import { HttpControllerService} from '../../core/http-controller.service';
 import { OptionService} from '../../base/option-service';
 
 @Injectable()
 export class JobOrderOperationPalletService extends BasePageService {
   constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
     super();
   }
 
   delete(id: string) { return this._httpSvc.delete('joborder/operation/pallet/delete/' + id, this._opt.getHeader()); }
 
   getDetail(id: string) { return this._httpSvc.get('joborder/operation/pallet/detail/' + id, this._opt.getHeader()); }
 
   save(data) { return this._httpSvc.post('joborder/operation/pallet/save', data, this._opt.getHeader()); }
 
   filter(data) { return this._httpSvc.post('joborder/operation/pallet/filter', data, this._opt.getHeader()); }
 
   filterObservable(data) { return this._httpSvc.postObservable('joborder/operation/pallet/filter', data, this._opt.getHeader()); }
 }
 