import { Injectable } from '@angular/core';
import { HttpControllerService } from '../core/http-controller.service';
import { OptionService } from '../base/option-service';
import { BasePageService } from '../base/base-page.service';
import { ShareHttpCallsService } from './shared-http-calls.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGenericGroupService extends BasePageService {


  constructor(
    private _httpSvc: HttpControllerService,
    private _httpSharedSvc: ShareHttpCallsService,
    private _opt: OptionService) {
    super();
  }
  getEmployeeGenericGroupTypes() {
    return this._httpSvc.get('employee/generic/group/EmployeeGenericGroupTypes', this._opt.getHeader());
  }
  save(data) {
    return this._httpSvc.post('employee/generic/group/save', data, this._opt.getHeader());
  }
  delete(id: string) {
    return this._httpSvc.delete('employee/generic/group/delete/' + id, this._opt.getHeader());
  }
  filter(data) {
    return this._httpSvc.post('employee/generic/group/filter', data, this._opt.getHeader());
  }
  filterObs(data) {
    return this._httpSvc.postObservable('employee/generic/group/filter', data, this._opt.getHeader());
  }
  filterShared(data) {
    return this._httpSharedSvc.post('employee/generic/group/filter', data, this._opt.getHeader());
  }
  getDetail(id: string) {
    return this._httpSvc.get('employee/generic/group/detail/' + id, this._opt.getHeader());
  }
  removeGenericGroupMem(req: any) {
    return this._httpSvc.post('employee/generic/group/removeGroupMember/', req, this._opt.getHeader());
  }
  addEmployeeGenericGroupSv(data) {
    return this._httpSvc.post('employee/generic/group/addNewMember', data, this._opt.getHeader());
  }
}
