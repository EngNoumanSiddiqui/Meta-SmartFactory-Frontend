import { Injectable } from '@angular/core';
import { BasePageService } from '../base/base-page.service';
import { HttpControllerService } from '../core/http-controller.service';
import { OptionService } from '../base/option-service';
@Injectable({
  providedIn: 'root'
})
export class ScrapService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  save(data) { return this._httpSvc.post('scrap/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('scrap/filter', data, this._opt.getHeader()); }
  panelFilter(data) { return this._httpSvc.post('panel/scrap/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('scrap/filter', data, this._opt.getHeader()); }
  delete(id) { return this._httpSvc.delete('scrap/delete/' + id, this._opt.getHeader()); }
  saveProdOrderForRework(data) { return this._httpSvc.post('prod-order/create/autoProdOrderForRework', data, this._opt.getHeader()); }
  getUpdateDetail(id) { return this._httpSvc.get('scrap/detail/' + id, this._opt.getHeader()); }
}
