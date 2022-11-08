import { BasePageService } from 'app/services/base/base-page.service';
import { Injectable } from '@angular/core';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceOrderPlanCycleItemsService  extends BasePageService{

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/order/plan/cycleitem/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/order/plan/cycleitem/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/order/plan/cycleitem/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/order/plan/cycleitem/filter', data, this._opt.getHeader()); }
}
