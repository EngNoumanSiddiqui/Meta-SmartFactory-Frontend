import { Injectable } from '@angular/core';
import { BasePageService } from '../base/base-page.service';
import { HttpControllerService } from '../core/http-controller.service';
import { OptionService } from '../base/option-service';
@Injectable()
export class ForkLiftService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  save(data) { return this._httpSvc.post('forklift/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('forklift/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('forklift/filter', data, this._opt.getHeader()); }
  delete(id) { return this._httpSvc.delete('forklift/delete/' + id, this._opt.getHeader()); }
  
  getUpdateDetail(id) { return this._httpSvc.get('forklift/detail/' + id, this._opt.getHeader()); }
}
