import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { tap, publishReplay } from 'rxjs/operators';
import { ConnectableObservable } from 'rxjs';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class EnumOrderStatusService extends BasePageService {
  constructor(private _httpSvc: ShareHttpCallsService, private _opt: OptionService ) {
    super();
  }

  getOrderEnumList() {
    return this._httpSvc.get('OrderStatusEnum', this._opt.getHeader()).toPromise();  
  }
  getOrderDetailEnumList() { 
    return this._httpSvc.get('OrderDetailStatusEnum', this._opt.getHeader()).toPromise();
  }
}

