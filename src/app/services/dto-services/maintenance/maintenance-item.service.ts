import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class MaintenanceItemService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService,private _httpSharedvc: ShareHttpCallsService  ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/order/plan/item/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/order/plan/item/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/order/plan/item/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/order/plan/item/filter', data, this._opt.getHeader()); }

  filterShared(data) { return this._httpSharedvc.post('maintenance/order/plan/item/filter', data, this._opt.getHeader()); }

}
