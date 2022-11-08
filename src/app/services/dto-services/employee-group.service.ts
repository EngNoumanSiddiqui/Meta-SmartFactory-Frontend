import {Injectable} from '@angular/core';
import {BasePageService} from 'app/services/base/base-page.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {HttpControllerService} from '../core/http-controller.service';
import {OptionService} from '../base/option-service';
import { ShareHttpCallsService } from './shared-http-calls.service';

@Injectable()

export class EmployeeGroupService extends BasePageService {
  private employeeExceptionDetail = new BehaviorSubject<any>({});

  constructor(
    private _httpSvc: HttpControllerService,
    private _httpSharedSvc: ShareHttpCallsService,
    private _opt: OptionService) {
    super();
  }

  set notifyEmployeeExceptionDetail(data: any) {
    this.clearState();
    this.employeeExceptionDetail.next(data);
  }

  get notifyEmployeeExceptionDetail() {
    return this.employeeExceptionDetail.asObservable();
  }

  clearState() {
    this.employeeExceptionDetail.next({});
  }

  delete(id: string) {
    return this._httpSvc.delete('employee/shift/group/delete/' + id, this._opt.getHeader());
  }

  // getDetailAllEmployeesNotGrouped() {
  //   return this._httpSvc.get('employee/shift/group/allEmployeesNotGrouped/', this._opt.getHeader());
  // }

  getAllEmployees(data) {
    return this._httpSvc.post('employee/filterEmployee', data, this._opt.getHeader());
  }

  getDetail(id: string) {
    return this._httpSvc.get('employee/shift/group/detail/' + id, this._opt.getHeader());
  }

  getGroupShift(id: string) {
    return this._httpSvc.get('employee/shifts/getGroupShift/' + id, this._opt.getHeader());
  }

  getEmployeeShift(id: string) {
    return this._httpSvc.get('employee/shifts/getEmployeeShift/' + id, this._opt.getHeader());
  }

  deleteGroupShift(id: string) {
    return this._httpSvc.delete('employee/shifts/deleteGroupShift/' + id, this._opt.getHeader());
  }

  deleteEmployeeShift(id: string) {
    return this._httpSvc.delete('employee/shifts/deleteEmployeeShift/' + id, this._opt.getHeader());
  }

  save(data) {
    return this._httpSvc.post('employee/shift/group/save', data, this._opt.getHeader());
  }

  genericSave(data) {
    return this._httpSvc.post('employee/generic/group/save', data, this._opt.getHeader());
  }

  /*********** require separate service ***************/
  rejectEmployeeExceptionalShift(id) {
    return this._httpSvc.get('employeeShiftsExceptions/reject/' + id, this._opt.getHeader());
  }

  acceptEmployeeExceptionalShift(id) {
    return this._httpSvc.get('employeeShiftsExceptions/confirm/' + id, this._opt.getHeader());
  }

  getEmployeeExceptionalShiftDetail(id: string) {
    return this._httpSvc.get('employeeShiftsExceptions/detail/' + id, this._opt.getHeader());
  }

  saveEmployeeShift(data) {
    return this._httpSvc.post('employee/shifts/save', data, this._opt.getHeader());
  }

  filterEmployeeShiftException(data) {
    return this._httpSvc.post('employeeShiftsExceptions/filterExceptions', data, this._opt.getFileHeader());
  }

  filterEmployeeShift(data) {
    return this._httpSvc.post('employee/shifts/filter', data, this._opt.getFileHeader());
  }


  saveEmployeeShiftsExceptions(data) {
    return this._httpSvc.post('employeeShiftsExceptions/save', data, this._opt.getHeader());
  }

  deleteEmpShiftExceptions(id: string) {
    return this._httpSvc.delete('employeeShiftsExceptions/deleteException/' + id, this._opt.getHeader());
  }

  addShiftGroupMember(data) {
    return this._httpSvc.post('employee/shift/group/addNewMember', data, this._opt.getHeader());
  }

  /***********require separate service ***************/
  update(data) {
    return this._httpSvc.post('employee/update', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('employee/shift/group/filter', data, this._opt.getHeader());
  }

  search(data) {
    return this._httpSvc.post('employee/search', data, this._opt.getHeader());
  }

  removeShiftGroupMem(res: any) {
    return this._httpSvc.post('employee/shift/group/removeGroupMember/', res, this._opt.getHeader());
  }
}
