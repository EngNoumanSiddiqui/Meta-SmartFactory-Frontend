import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class SamplingProcedurePointService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterSamplingProcedurePoint(data) { 
    return this._httpSvc.post('quality/samplingProcedurePoint/filter', data, this._opt.getHeader()); 
  }

  detailSamplingProcedurePoint(id: string) {
     return this._httpSvc.get('quality/samplingProcedurePoint/detail/' + id, this._opt.getHeader()); 
  }

  saveSamplingProcedurePoint(data) {
    return this._httpSvc.post('quality/samplingProcedurePoint/save', data, this._opt.getHeader());
  }

  updateSamplingProcedurePoint(data) {
    return this._httpSvc.post('quality/samplingProcedurePoint/save', data, this._opt.getHeader());
  }

  deleteSamplingProcedurePoint(id) {
    return this._httpSvc.delete('/quality/samplingProcedurePoint/delete/' + id, this._opt.getHeader());
  }

}
