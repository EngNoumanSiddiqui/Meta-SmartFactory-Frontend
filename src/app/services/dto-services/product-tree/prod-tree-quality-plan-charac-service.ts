
import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()

export class ProductTreeDetailQualityPlanCharacService extends BasePageService {
    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
    }

    delete(id: string) { return this._httpSvc.delete('productTree/detailQualityPlanCharacOperation/delete/' + id, this._opt.getHeader()); }

    getDetail(id: string) { return this._httpSvc.get('productTree/detailQualityPlanCharacOperation/detail/' + id, this._opt.getHeader()); }

    save(data) { return this._httpSvc.post('productTree/detailQualityPlanCharacOperation/save', data, this._opt.getHeader()); }

    filter(data) { return this._httpSvc.post('productTree/detailQualityPlanCharacOperation/filter', data, this._opt.getHeader()); }

    filterObservable(data) { return this._httpSvc.postObservable('productTree/detailQualityPlanCharacOperation/filter', data, this._opt.getHeader()); }
}
