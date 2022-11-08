import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class GeneralSettingItemValueService extends BasePageService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('generalSetting/item/value/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('generalSetting/item/value/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('generalSetting/item/value/save', data, this._opt.getHeader()); }
  saveObservable(data) { return this._httpSvc.postObservable('generalSetting/item/value/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('generalSetting/item/value/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('generalSetting/item/value/filter', data, this._opt.getHeader()); }

}
