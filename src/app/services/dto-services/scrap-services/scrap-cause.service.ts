import { Injectable } from '@angular/core';
import { BasePageService } from 'app/services/base/base-page.service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable({
  providedIn: 'root'
})
export class ScrapCauseService extends BasePageService {
    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
        super();
    }

    // getAllScrapCauses() { return this._httpSvc.get('scrap/cause/filter',this._opt.getHeader()); }
    save(data) { return this._httpSvc.post('scrap/cause/save', data, this._opt.getHeader()); }
    filter(data) { return this._httpSvc.post('scrap/cause/filter', data, this._opt.getHeader()); }
    filterObservable(data) { return this._httpSvc.postObservable('scrap/cause/filter', data, this._opt.getHeader()); }
    delete(id) { return this._httpSvc.delete('scrap/cause/delete/' + id, this._opt.getHeader()); }
    getUpdateDetail(id) { return this._httpSvc.get('scrap/cause/detail/' + id, this._opt.getHeader()); }
}
