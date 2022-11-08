/**
 * Created by reis on 31.07.2019.
 */

import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class EquipmentAbcIndicatorService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService,  
    private _httpSharedvc: ShareHttpCallsService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipment/abcIndicator/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipment/abcIndicator/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipment/abcIndicator/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipment/abcIndicator/filter', data, this._opt.getHeader()); }
  filterShared(data) { return this._httpSharedvc.post('equipment/abcIndicator/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('equipment/abcIndicator/filter', data, this._opt.getHeader()); }
}
