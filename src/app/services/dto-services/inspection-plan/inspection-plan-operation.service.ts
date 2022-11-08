import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class InspectionPlanOperationService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterInsPlanOperation(data) { 
    return this._httpSvc.post('quality/inspectionPlanOperation/filter', data, this._opt.getHeader()); 
  }
  filterInsPlanOperationObservable(data) { 
    return this._httpSvc.postObservable('quality/inspectionPlanOperation/filter', data, this._opt.getHeader()); 
  }

  detailInsPlanOperation(id: string) {
     return this._httpSvc.get('quality/inspectionPlanOperation/detail/' + id, this._opt.getHeader()); 
  }

  saveInsPlanOperation(data) {
    return this._httpSvc.post('quality/inspectionPlanOperation/save', data, this._opt.getHeader());
  }

  updateInsPlanOperation(data) {
    return this._httpSvc.post('quality/inspectionPlanOperation/save', data, this._opt.getHeader());
  }

  deleteInsPlanOperation(id) {
    return this._httpSvc.delete('/quality/inspectionPlanOperation/delete/' + id, this._opt.getHeader());
  }
}
