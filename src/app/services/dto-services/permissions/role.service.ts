import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class RoleService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  getList() {
    return this._httpSvc.get('role/getList', this._opt.getHeader());
  }

  save(data) {
    return this._httpSvc.post('role/save', data, this._opt.getHeader());
  }

  update(data) {
    return this._httpSvc.post('role/update', data, this._opt.getHeader());
  }

  getDetail(id) {
    return this._httpSvc.get('role/detail/' + id, this._opt.getHeader());
  }

  filter(data) { return this._httpSvc.post('role/filterRoles', data, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('role/deleteRole/' + id, this._opt.getHeader()); }
}
