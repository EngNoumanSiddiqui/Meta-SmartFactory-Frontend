
import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()

export class ProductTreeDetailQualityPlanService extends BasePageService {
    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
    }

    delete(id: string) { return this._httpSvc.delete('productTree/detailQualityPlan/delete/' + id, this._opt.getHeader()); }

    getDetail(id: string) { return this._httpSvc.get('productTree/detailQualityPlan/detail/' + id, this._opt.getHeader()); }

    save(data) { return this._httpSvc.post('productTree/detailQualityPlan/save', data, this._opt.getHeader()); }

    filter(data) { return this._httpSvc.post('productTree/detailQualityPlan/filter', data, this._opt.getHeader()); }

    filterObservable(data) { return this._httpSvc.postObservable('productTree/detailQualityPlan/filter', data, this._opt.getHeader()); }
}
