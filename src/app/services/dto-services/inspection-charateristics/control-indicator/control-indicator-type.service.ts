import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';

@Injectable()
export class ControlIndicatorTypeService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterControlIndicatorType(data) { 
    return this._httpSvc.post('quality/controlIndicatorType/filter', data, this._opt.getHeader()); 
  }
  filterControlIndicatorTypeObservable(data) { 
    return this._httpSvc.postObservable('quality/controlIndicatorType/filter', data, this._opt.getHeader()); 
  }

  detailControlIndicatorType(id: string) {
     return this._httpSvc.get('quality/controlIndicatorType/detail/' + id, this._opt.getHeader()); 
  }

  saveControlIndicatorType(data) {
    return this._httpSvc.post('quality/controlIndicatorType/save', data, this._opt.getHeader());
  }

  deleteControlIndicatorType(id) {
    return this._httpSvc.delete('/quality/controlIndicatorType/delete/' + id, this._opt.getHeader());
  }
}
