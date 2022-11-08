import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class EquipmentCodeGroupHeaderService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ,   private _httpSharedvc: ShareHttpCallsService) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipment/CodeGroupHeaderHeader/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipment/CodeGroupHeaderHeader/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipment/CodeGroupHeaderHeader/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipment/CodeGroupHeaderHeader/filter', data, this._opt.getHeader()); }
  filterShared(data) { return this._httpSharedvc.post('equipment/CodeGroupHeaderHeader/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('equipment/CodeGroupHeaderHeader/filter', data, this._opt.getHeader()); }
}
