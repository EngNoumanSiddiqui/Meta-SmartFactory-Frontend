import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class PurchaseConditionTypeService extends BasePageService {
    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
    }

    detail(id: string) { return this._httpSvc.get('purchase/condition/type/detail/' + id, this._opt.getHeader()); }


    delete(id: string) { return this._httpSvc.get('purchase/condition/type/delete/' + id, this._opt.getHeader()); }

    save(data) { return this._httpSvc.post('purchase/condition/type/save', data, this._opt.getHeader()); }

    filterObservable(data) { return this._httpSvc.postObservable('purchase/condition/type/filter', data, this._opt.getHeader()); }

    get(data) { return this._httpSvc.post('purchase/condition/type/filter', data, this._opt.getHeader()); }

}
