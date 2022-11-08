import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class EquipmentService extends BasePageService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService, 
    private _httpSharedvc: ShareHttpCallsService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipment/deleteEquipment/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipment/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipment/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('equipment/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipment/filterequipment', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('equipment/filterequipment', data, this._opt.getHeader()); }
  filterSharedObservable(data) { return this._httpSharedvc.post('equipment/filterequipment', data, this._opt.getHeader()); }
}
