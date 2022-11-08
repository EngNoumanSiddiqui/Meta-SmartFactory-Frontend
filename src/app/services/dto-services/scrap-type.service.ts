import { Injectable } from '@angular/core';
import { HttpControllerService } from '../core/http-controller.service';
import { BasePageService } from '../base/base-page.service';
import { OptionService } from '../base/option-service';
@Injectable({
  providedIn: 'root'
})
export class ScrapTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
getAllScrapTypes() { return this._httpSvc.get('scrap/type/filter',this._opt.getHeader()); }

save(data) { return this._httpSvc.post('scrap/type/save', data, this._opt.getHeader()); }
filter(data) { return this._httpSvc.post('scrap/type/filter', data, this._opt.getHeader()); }

delete(id) { return this._httpSvc.delete('scrap/type/delete/'+id, this._opt.getHeader()); }
getUpdateDetail(id){ return this._httpSvc.get('scrap/type/detail/' + id,this._opt.getHeader());}

}