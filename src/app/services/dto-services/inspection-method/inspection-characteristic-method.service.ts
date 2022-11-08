import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class InspectionCharacteristicMethodService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterinspectionCharacteristicMethod(data) { 
    return this._httpSvc.post('quality/inspectionCharacteristicMethod/filter', data, this._opt.getHeader()); 
  }

  detailinspectionCharacteristicMethod(id: string) {
     return this._httpSvc.get('quality/inspectionCharacteristicMethod/detail/' + id, this._opt.getHeader()); 
  }

  saveinspectionCharacteristicMethod(data) {
    return this._httpSvc.post('quality/inspectionCharacteristicMethod/save', data, this._opt.getHeader());
  }

  updateinspectionCharacteristicMethod(data) {
    return this._httpSvc.post('quality/inspectionCharacteristicMethod/save', data, this._opt.getHeader());
  }

  deleteinspectionCharacteristicMethod(id) {
    return this._httpSvc.delete('/quality/inspectionCharacteristicMethod/delete/' + id, this._opt.getHeader());
  }
}
