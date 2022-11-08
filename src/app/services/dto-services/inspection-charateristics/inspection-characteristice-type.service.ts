import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class InspectionCharacteristicTypeService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterInspCharacteristic(data) { 
    return this._httpSvc.post('quality/inspectionCharacteristicType/filter', data, this._opt.getHeader()); 
  }

  filterInspCharacteristicObservable(data) { 
    return this._httpSvc.postObservable('quality/inspectionCharacteristicType/filter', data, this._opt.getHeader()); 
  }
  detailInspCharacteristic(id: string) {
     return this._httpSvc.get('quality/inspectionCharacteristicType/detail/' + id, this._opt.getHeader()); 
  }

  saveInspCharacteristic(data) {
    return this._httpSvc.post('quality/inspectionCharacteristicType/save', data, this._opt.getHeader());
  }

  deleteInspCharacteristic(id) {
    return this._httpSvc.delete('/quality/inspectionCharacteristicType/delete/' + id, this._opt.getHeader());
  }

}
