import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class PurchaseConditionRecordService extends BasePageService {
    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
    }

    detail(id: string) { return this._httpSvc.get('purchase/condition/record/detail/' + id, this._opt.getHeader()); }


    delete(id: string) { return this._httpSvc.get('purchase/condition/record/delete/' + id, this._opt.getHeader()); }

    save(data) { return this._httpSvc.post('purchase/condition/record/save', data, this._opt.getHeader()); }

    filterObservable(data) { return this._httpSvc.postObservable('purchase/condition/record/filter', data, this._opt.getHeader()); }

    get(data) { return this._httpSvc.post('purchase/condition/record/filter', data, this._opt.getHeader()); }

}
