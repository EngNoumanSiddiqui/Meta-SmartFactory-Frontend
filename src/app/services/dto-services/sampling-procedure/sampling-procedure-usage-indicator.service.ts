import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class SamplingProcedureUsageIndicatorService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterSamplingProcedureUsageIndicator(data) { 
    return this._httpSvc.post('quality/samplingUsageIndicator/filter', data, this._opt.getHeader()); 
  }

  detailSamplingProcedureUsageIndicator(id: string) {
     return this._httpSvc.get('quality/samplingUsageIndicator/detail/' + id, this._opt.getHeader()); 
  }

  saveSamplingProcedureUsageIndicator(data) {
    return this._httpSvc.post('quality/samplingUsageIndicator/save', data, this._opt.getHeader());
  }

  updateSamplingProcedureUsageIndicator(data) {
    return this._httpSvc.post('quality/samplingUsageIndicator/save', data, this._opt.getHeader());
  }

  deleteSamplingProcedureUsageIndicator(id) {
    return this._httpSvc.delete('/quality/samplingUsageIndicator/delete/' + id, this._opt.getHeader());
  }

}
