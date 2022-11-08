import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class MaintenancePlanScheduleCallService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/order/plan/schedule/call/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/order/plan/schedule/call/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/order/plan/schedule/call/save', data, this._opt.getHeader()); }
  create(maintenancePlanId) { return this._httpSvc.get('maintenance/order/plan/schedule/call/create/' + maintenancePlanId, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('maintenance/order/plan/schedule/call/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('maintenance/order/plan/schedule/call/filter', data, this._opt.getHeader()); }
}
