
import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class MaintenancePlaningService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/order/plan/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/order/plan/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/order/plan/save', data, this._opt.getHeader()); }
  /*confirmDate(data) { return this._httpSvc.post('maintenance/order/plan/confirmDate', data, this._opt.getHeader()); }
  setMaintenanceReason(data) { return this._httpSvc.post('maintenance/order/plan/setMaintenanceReason', data, this._opt.getHeader()); }
*/
  filter(data) { return this._httpSvc.post('maintenance/order/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('maintenance/order/plan/filter', data, this._opt.getHeader()); }
}
