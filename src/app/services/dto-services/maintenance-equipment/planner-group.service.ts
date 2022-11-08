import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class EquipmentPlannerGroupService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService,
    private _httpSharedvc: ShareHttpCallsService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipmentPlannerGroup/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipmentPlannerGroup/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipmentPlannerGroup/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipmentPlannerGroup/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('equipmentPlannerGroup/filter', data, this._opt.getHeader()); }
  filterSharedObservable(data) { return this._httpSharedvc.post('equipmentPlannerGroup/filter', data, this._opt.getHeader()); }
}
