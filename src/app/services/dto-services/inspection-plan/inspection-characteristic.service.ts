import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { of } from 'rxjs';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable()
export class InspectionCharOpService extends BasePageService {

  
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }
 
 filter(data) { 
   return this._httpSvc.post('quality/inspectionCharacteristicOperation/filter', data, this._opt.getHeader()); 
 }
 filterObservable(data) { 
   return this._httpSvc.postObservable('quality/inspectionCharacteristicOperation/filter', data, this._opt.getHeader()); 
 }

 detail(id: string) {
    return this._httpSvc.get('quality/inspectionCharacteristicOperation/detail/' + id, this._opt.getHeader()); 
 }

 save(data) {
   return this._httpSvc.post('quality/inspectionCharacteristicOperation/save', data, this._opt.getHeader());
 }


 delete(id) {
   return this._httpSvc.delete('/quality/inspectionCharacteristicOperation/delete/' + id, this._opt.getHeader());
 }
}
