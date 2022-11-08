import {Injectable} from '@angular/core';
import {BasePageService} from 'app/services/base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class EmployeeSkillService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }
  save(data) {
    return this._httpSvc.post('skillmatrix/employee/save', data, this._opt.getHeader());
  }
  saveAll(data) {
    return this._httpSvc.post('skillmatrix/employee/save/all', data, this._opt.getHeader());
  }
  getDetail(id) {
    return this._httpSvc.get('skillmatrix/employee/detail/' + id, this._opt.getHeader());
  }

  filter(data) { return this._httpSvc.post('skillmatrix/employee/filter', data, this._opt.getHeader()); }
  filterCompare(data) { return this._httpSvc.post('skillmatrix/employee/filterCompare', data, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('skillmatrix/employee/delete/' + id, this._opt.getHeader()); }

  filterCategory(data) { return this._httpSvc.post('skillmatrix/category/filter', data, this._opt.getHeader()); }
}
