import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable({
  providedIn: 'root'
})

export class CmsLogService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  save(data) {
    return this._httpSvc.post('cms/log/save', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('cms/log/filter', data, this._opt.getHeader());
  }

  delete(id) {
    return this._httpSvc.delete('cms/log/delete/' + id, this._opt.getHeader());
  }

  detail(id) {
    return this._httpSvc.get('cms/log/detail/' + id, this._opt.getHeader());
  }

}
