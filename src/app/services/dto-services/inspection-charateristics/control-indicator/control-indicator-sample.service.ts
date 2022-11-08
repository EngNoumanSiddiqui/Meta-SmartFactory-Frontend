import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';

@Injectable()
export class ControlIndicatorSampleService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterControlIndicatorSample(data) { 
    return this._httpSvc.post('quality/controlIndicatorSample/filter', data, this._opt.getHeader()); 
  }

  detailControlIndicatorSample(id: string) {
     return this._httpSvc.get('quality/controlIndicatorSample/detail/' + id, this._opt.getHeader()); 
  }

  saveControlIndicatorSample(data) {
    return this._httpSvc.post('quality/controlIndicatorSample/save', data, this._opt.getHeader());
  }
  deleteControlIndicatorSample(id) {
    return this._httpSvc.delete('/quality/controlIndicatorSample/delete/' + id, this._opt.getHeader());
  }

}
