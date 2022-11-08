
import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class EquipmentTaskService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('equipment/task/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('equipment/task/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('equipment/task/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('equipment/task/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('equipment/task/filter', data, this._opt.getHeader()); }

  saveMaintenancePackage(data) { return this._httpSvc.post('maintenance/StrategyPackage/save', data, this._opt.getHeader()); }

}
