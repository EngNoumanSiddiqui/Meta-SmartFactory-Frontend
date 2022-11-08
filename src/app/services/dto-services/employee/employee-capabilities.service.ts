import {Injectable} from '@angular/core';
import {BasePageService} from 'app/services/base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class EmployeeCapabilityService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }
  save(data) {
    return this._httpSvc.post('skillmatrix/save', data, this._opt.getHeader());
  }
  getDetail(id) {
    return this._httpSvc.get('skillmatrix/detail/' + id, this._opt.getHeader());
  }

  filter(data) { return this._httpSvc.post('skillmatrix/filter', data, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('skillmatrix/delete/' + id, this._opt.getHeader()); }

  filterCategory(data) { return this._httpSvc.post('skillmatrix/category/filter', data, this._opt.getHeader()); }
  detailCategory(id) { return this._httpSvc.get('skillmatrix/category/detail/' + id, this._opt.getHeader());}
  filterCategoryObservable(data) { return this._httpSvc.postObservable('skillmatrix/category/filter', data, this._opt.getHeader()); }
}
