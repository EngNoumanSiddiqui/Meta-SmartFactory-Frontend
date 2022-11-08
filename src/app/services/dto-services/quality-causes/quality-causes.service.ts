import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualityCausesService extends BasePageService { 
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filterCause(data) { 
   return this._httpSvc.post('quality/cause/filter', data, this._opt.getHeader()); 
 }
 filterCauseObservable(data) { 
  return this._httpSvc.postObservable('quality/cause/filter', data, this._opt.getHeader()); 
}

 detailCause(id: string) {
    return this._httpSvc.get('quality/cause/detail/' + id, this._opt.getHeader()); 
 }

 saveCause(data) {
   return this._httpSvc.post('quality/cause/save', data, this._opt.getHeader());
 }

 updateCause(data) {
   return this._httpSvc.post('quality/cause/save', data, this._opt.getHeader());
 }

 deleteCause(id) {
   return this._httpSvc.delete('/quality/cause/delete/' + id, this._opt.getHeader());
 }
}
