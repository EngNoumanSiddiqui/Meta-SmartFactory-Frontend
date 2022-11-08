import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable({
  providedIn: 'root'
})

export class CmsTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  save(data) {
    return this._httpSvc.post('cms/type/save', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('cms/type/filter', data, this._opt.getHeader());
  }

  delete(id) {
    return this._httpSvc.delete('cms/type/delete/' + id, this._opt.getHeader());
  }

  detail(id) {
    return this._httpSvc.get('cms/type/detail/' + id, this._opt.getHeader());
  }

}
