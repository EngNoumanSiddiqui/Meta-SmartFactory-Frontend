import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import {Observable} from 'rxjs';
import { ShareHttpCallsService } from '../shared-http-calls.service';
@Injectable()

export class EmployeeService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _httpSharedvc: ShareHttpCallsService,
     private _opt: OptionService) {
        super();
  }

  delete(id: string) {
    return this._httpSvc.delete('employee/deleteEmployee/' + id, this._opt.getHeader());
  }

  getDetail(id: string) {
    return this._httpSvc.get('employee/detail/' + id, this._opt.getHeader());
  }

  save(data) {
    return this._httpSvc.post('employee/save', data, this._opt.getHeader());
  }

  update(data) {
    return this._httpSvc.post('employee/update', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('employee/filterEmployee', data, this._opt.getHeader());
  }
  filterShared(data) {
    return this._httpSharedvc.post('employee/filterEmployee', data, this._opt.getHeader());
  }

  search(term): Observable<any[]> {
    return this._httpSvc.postObservable('employee/search', term, this._opt.getHeader());
  }

  filterEmployee(term): Observable<any[]> {
    return this._httpSvc.postObservable('employee/filterEmployee', term, this._opt.getHeader());
  }

  getProfileDetail() {
      return this._httpSvc.get('employee/profile/detail', this._opt.getHeader());
  }

  changePassword(pwd) {
    return this._httpSvc.post('employee/changePassword', pwd, this._opt.getHeader());
  }

  resetPassword(pwd) {
    return this._httpSvc.post('employee/reset/password', pwd, this._opt.getHeader());
  }

  updateProfile(data) {
    return this._httpSvc.post('employee/update/profile', data, this._opt.getHeader());
  }

  getEmployeeReportSum(data) {
    return this._httpSvc.post('employee/employeeReportSum', data, this._opt.getHeader());
  }
  getEmployeeReportDetail(data) {
    return this._httpSvc.post('employee/employeeReportDetail', data, this._opt.getHeader());
  }

  getEmployeesummaryForJobOrderOperationReport(jobOrderOperationId) {
    return this._httpSvc.get('employeeLoginSummary/employeeSummaryForJobOrderOperationReport/' +jobOrderOperationId, this._opt.getHeader());
  }
  
  getEmployeeLoginSummaryReportDetail(data) {
    return this._httpSvc.post('employeeLoginSummary/employeeSummary', data, this._opt.getHeader());
  }
  getEmployeeJobOrderStopSummaryDetail(data) {
    return this._httpSvc.post('employeeLoginSummary/employeeJobOrderStopSummary', data, this._opt.getHeader());
  }


  getLaborScheduleDetail(data) {
    return this._httpSvc.postObservable('laborAutoScheduling/filter', data, this._opt.getHeader());
  }

  getEmployeeReportSumGroupedByDayShiftEmployee(data) {
    return this._httpSvc.post('employee/employeeReportSumByDayShiftEmployee', data, this._opt.getHeader());
  }
}
