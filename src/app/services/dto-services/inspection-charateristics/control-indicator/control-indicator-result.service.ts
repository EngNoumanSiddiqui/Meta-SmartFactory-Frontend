import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';

@Injectable()
export class ControlIndicatorResultService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterControlIndicatorResult(data) { 
    return this._httpSvc.post('quality/controlIndicatorResult/filter', data, this._opt.getHeader()); 
  }

  detailControlIndicatorResult(id: string) {
     return this._httpSvc.get('quality/controlIndicatorResult/detail/' + id, this._opt.getHeader()); 
  }

  saveControlIndicatorResult(data) {
    return this._httpSvc.post('quality/controlIndicatorResult/save', data, this._opt.getHeader());
  }
  deleteControlIndicatorResult(id) {
    return this._httpSvc.delete('/quality/controlIndicatorResult/delete/' + id, this._opt.getHeader());
  }

}
