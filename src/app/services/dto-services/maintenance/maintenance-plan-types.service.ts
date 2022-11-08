import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class MaintenancePlanTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService, private _httpSharedvc: ShareHttpCallsService ) {
    super();
  }

  getOrderTypeEnum() { return this._httpSharedvc.get('MaintenanceOrderPlanTypeEnum', this._opt.getHeader()); }
  delete(id: string) { return this._httpSvc.delete('maintenance/OrderPlanType/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/OrderPlanType/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/OrderPlanType/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/OrderPlanType/filter', data, this._opt.getHeader()); }

}
