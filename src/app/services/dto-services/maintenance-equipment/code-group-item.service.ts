import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class EquipmentCodeGroupItemService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipment/CodeGroupItemItem/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipment/CodeGroupItemItem/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipment/CodeGroupItemItem/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipment/CodeGroupItemItem/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('equipment/CodeGroupItemItem/filter', data, this._opt.getHeader()); }
}
