import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class PreferenceService extends BasePageService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  deletegeneralSettingCategoryById(generalSettingCategoryId: string) { return this._httpSvc.delete('generalSetting/category/delete/' + generalSettingCategoryId, this._opt.getHeader()); }

  getDetailgeneralSettingCategoryId(generalSettingCategoryId: string) { return this._httpSvc.get('generalSetting/category/detail/' + generalSettingCategoryId, this._opt.getHeader()); }

  savegeneralSettingCategory(data) { return this._httpSvc.post('generalSetting/category/save', data, this._opt.getHeader()); }
  savegeneralSettingCategoryObservable(data) { return this._httpSvc.postObservable('generalSetting/category/save', data, this._opt.getHeader()); }

//   update(data) { return this._httpSvc.post('equipment/update', data, this._opt.getHeader()); }

  filtergeneralSettingCategory(data) { return this._httpSvc.post('generalSetting/category/filter', data, this._opt.getHeader()); }
  filtergeneralSettingCategoryObservable(data) { return this._httpSvc.postObservable('generalSetting/category/filter', data, this._opt.getHeader()); }

}
