import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable({
    providedIn: 'root'
})

export class UsageDecisionTypeService extends BasePageService {

    constructor(
        private _httpSvc: HttpControllerService,
        private _opt: OptionService
    ) {
        super();
    }


    filter(data) {
        return this._httpSvc.post('quality/usageDecisionType/filter', data, this._opt.getHeader());
    }

    detail(id: string) {
        return this._httpSvc.get('quality/usageDecisionType/detail/' + id, this._opt.getHeader());
    }

    save(data) {
        return this._httpSvc.post('quality/usageDecisionType/save', data, this._opt.getHeader());
    }

    update(data) {
        return this._httpSvc.post('quality/usageDecisionType/save', data, this._opt.getHeader());
    }

    delete(id) {
        return this._httpSvc.delete('quality/usageDecisionType/delete/' + id, this._opt.getHeader());
    }

}
