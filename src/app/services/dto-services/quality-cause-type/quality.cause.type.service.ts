import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable({
  providedIn: 'root'
})
export class QualityCauseTypeService extends BasePageService { 
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filter(data) { 
   return this._httpSvc.post('quality/causeType/filter', data, this._opt.getHeader()); 
 }
 filterObservable(data) { 
  return this._httpSvc.postObservable('quality/causeType/filter', data, this._opt.getHeader()); 
}

 detail(id: string) {
    return this._httpSvc.get('quality/causeType/detail/' + id, this._opt.getHeader()); 
 }

 save(data) {
   return this._httpSvc.post('quality/causeType/save', data, this._opt.getHeader());
 }

 update(data) {
   return this._httpSvc.post('quality/causeType/save', data, this._opt.getHeader());
 }

 delete(id) {
   return this._httpSvc.delete('/quality/causeType/delete/' + id, this._opt.getHeader());
 }
}
