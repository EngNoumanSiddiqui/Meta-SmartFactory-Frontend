import { Injectable } from '@angular/core';
import { OptionService } from 'app/services/base/option-service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';

@Injectable({providedIn: 'root'})
export class SalesDashboardService extends BasePageService {
    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) { super(); }

    getSalesInfo(data: any) {
        return this._httpSvc.postObservable('dashboard/sales/getSalesInfo', data, this._opt.getHeader());
    }
}
