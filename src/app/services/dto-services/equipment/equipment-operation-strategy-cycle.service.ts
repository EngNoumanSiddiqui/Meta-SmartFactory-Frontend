import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class EquipmenttaskOperationStrCycleService extends BasePageService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipment/task/operation/strategy/cycle/delete' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipment/task/operation/strategy/cycle/detail' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipment/task/operation/strategy/cycle/save', data, this._opt.getHeader()); }
  saveObservable(data) { return this._httpSvc.postObservable('equipment/task/operation/strategy/cycle/save', data, this._opt.getHeader()); }

//   update(data) { return this._httpSvc.post('equipment/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipment/task/operation/strategy/cycle/filter', data, this._opt.getHeader()); }
  filterObservable(data) { 
    return this._httpSvc.postObservable('equipment/task/operation/strategy/cycle/filter', data, this._opt.getHeader());
  }

}
