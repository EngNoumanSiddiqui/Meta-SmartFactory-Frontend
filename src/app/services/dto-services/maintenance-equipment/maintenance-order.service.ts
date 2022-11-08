
import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';
/**
 * Created by reis on 31.07.2019.
 */


@Injectable()
export class MaintenanceOrderService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/order/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/order/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/order/save', data, this._opt.getHeader()); }
  finishPanelMaintenanceOrder(data) { return this._httpSvc.post('oanel/maintenance/order/finish', data, this._opt.getHeader()); }
  statusChange(data) { return this._httpSvc.post('maintenance/order/statusChange', data, this._opt.getHeader()); }
  confirmDate(data) { return this._httpSvc.post('maintenance/order/confirmDate', data, this._opt.getHeader()); }
  setMaintenanceReason(data) { return this._httpSvc.post('maintenance/order/setMaintenanceReason', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/order/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('maintenance/order/filter', data, this._opt.getHeader()); }
}
