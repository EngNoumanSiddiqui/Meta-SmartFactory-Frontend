import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
@Injectable()
export class QualityInfoRecordService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterRecord(data) { 
    return this._httpSvc.post('quality/info/record/filter', data, this._opt.getHeader()); 
  }

  detailRecord(id: string) {
     return this._httpSvc.get('quality/info/record/detail/' + id, this._opt.getHeader()); 
  }

  saveRecord(data) {
    return this._httpSvc.post('quality/info/record/save', data, this._opt.getHeader());
  }

  updateRecord(data) {
    return this._httpSvc.post('quality/info/record/save', data, this._opt.getHeader());
  }

  deleteRecord(id) {
    return this._httpSvc.delete('quality/info/record/delete/' + id, this._opt.getHeader());
  }
}
