import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class EnumPOrderStatusService extends BasePageService {
  constructor(private _httpSvc: ShareHttpCallsService, private _opt: OptionService ) {
    super();
  }

  getEnumList() { return this._httpSvc.get('PurchaseOrderStatusEnum', this._opt.getHeader()).toPromise(); }
  getPurchaseOrderEnumList() { return this._httpSvc.get('PurchaseOrderTypeEnum', this._opt.getHeader()).toPromise(); }
  getProdOrderStatusEnum() { return this._httpSvc.get('prodOrderStatusEnum', this._opt.getHeader()).toPromise(); }
  getProductTreeStatusEnums() { return this._httpSvc.get('productTreeStatus', this._opt.getHeader()).toPromise(); }
}

