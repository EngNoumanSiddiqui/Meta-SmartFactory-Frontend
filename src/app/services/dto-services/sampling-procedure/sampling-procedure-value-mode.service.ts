import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class SamplingProcedureValueModeService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterSamplingProcedureValueMode(data) { 
    return this._httpSvc.post('quality/samplingProcedureValueMode/filter', data, this._opt.getHeader()); 
  }

  detailSamplingProcedureValueMode(id: string) {
     return this._httpSvc.get('quality/samplingProcedureValueMode/detail/' + id, this._opt.getHeader()); 
  }

  saveSamplingProcedureValueMode(data) {
    return this._httpSvc.post('quality/samplingProcedureValueMode/save', data, this._opt.getHeader());
  }

  updateSamplingProcedureValueMode(data) {
    return this._httpSvc.post('quality/samplingProcedureValueMode/save', data, this._opt.getHeader());
  }

  deleteSamplingProcedureValueMode(id) {
    return this._httpSvc.delete('/quality/samplingProcedureValueMode/delete/' + id, this._opt.getHeader());
  }

}
