import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class QualityCatalogGroupService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filtercatalogGroup(data) { 
    return this._httpSvc.post('quality/catalogGroup/filter', data, this._opt.getHeader()); 
  }

  detailcatalogGroup(id: string) {
     return this._httpSvc.get('quality/catalogGroup/detail/' + id, this._opt.getHeader()); 
  }

  savecatalogGroup(data) {
    return this._httpSvc.post('quality/catalogGroup/save', data, this._opt.getHeader());
  }

  updatecatalogGroup(data) {
    return this._httpSvc.post('quality/catalogGroup/save', data, this._opt.getHeader());
  }

  deletecatalogGroup(id) {
    return this._httpSvc.delete('/quality/catalogGroup/delete/' + id, this._opt.getHeader());
  }
}
