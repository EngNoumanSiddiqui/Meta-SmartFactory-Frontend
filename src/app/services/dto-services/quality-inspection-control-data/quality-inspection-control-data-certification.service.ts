import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
@Injectable()
export class QualityInspectionControlDataService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filter(data) { 
    return this._httpSvc.post('quality/inspectionControlData/filter', data, this._opt.getHeader()); 
  }

  detail(id: string) {
     return this._httpSvc.get('quality/inspectionControlData/detail/' + id, this._opt.getHeader()); 
  }

  save(data) {
    return this._httpSvc.post('quality/inspectionControlData/save', data, this._opt.getHeader());
  }
  delete(id) {
    return this._httpSvc.delete('quality/inspectionControlData/delete/' + id, this._opt.getHeader());
  }
}
