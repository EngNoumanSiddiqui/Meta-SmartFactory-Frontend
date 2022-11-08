import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class CityService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getIdNameList(countryId ) { return this._httpSvc.get('city/cities/' + countryId, this._opt.getHeader() ); }

  save(data) {
    return this._httpSvc.post('city/save', data, this._opt.getHeader());
  }
  delete(id: string) { return this._httpSvc.delete('city/delete/' + id, this._opt.getHeader()); }
}
