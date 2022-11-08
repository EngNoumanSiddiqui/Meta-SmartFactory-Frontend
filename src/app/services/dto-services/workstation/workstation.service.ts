import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService } from '../../base/option-service';
import { Subject } from 'rxjs';
import { ShareHttpCallsService } from '../shared-http-calls.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ServiceLocator } from '../job-order/service-location.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Injectable()
export class WorkstationService extends BasePageService {
  public saveAction$: Subject<any> = new Subject();
  constructor(private _httpSvc: HttpControllerService,
    private _httpShrdSvc: ShareHttpCallsService,
    private _opt: OptionService) {
    super();
  }


  public static showWorkstationDetailDialog(id) { 
    const loadingsrv = ServiceLocator.injector.get(LoaderService);
    loadingsrv.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }


  delete(id: string) {
    return this._httpSvc.delete('workstation/deleteWorkStation/' + id, this._opt.getHeader());
  }

  getDetail(id: string) {
    let d = new Date().getMilliseconds();
    return this._httpShrdSvc.get('workstation/detail/' + id + '?rand=' + d, this._opt.getHeader()).toPromise();
  }
  getWorkStationsForJobOrderPlanning(data) {
    return this._httpSvc.post('workstation/WorkStationsForJobOrderPlanning', data, this._opt.getHeader());
  }

  getUpdateDetail(id: string) {
    return this._httpSvc.get('workstation/detail/update/' + id, this._opt.getHeader());
  }

  save(data) {
    return this._httpSvc.post('workstation/save', data, this._opt.getHeader());
  }

  saveFactoryCalendar(data) {
    return this._httpSvc.post('factoryCalendar/save', data, this._opt.getHeader());
  }
  saveWorkstationCategory(data) {
    return this._httpSvc.post('workstation/saveCategory', data, this._opt.getHeader());
  }
  getFilterFactoryCalendarList(data) {
    return this._httpSvc.post('factoryCalendar/filter', data, this._opt.getHeader());
  }
  getFactoryCalendarById(id) {
    return this._httpSvc.get('factoryCalendar/detail/' + id, this._opt.getHeader());
  }
  deleteFactoryCalendar(id) {
    return this._httpSvc.delete('factoryCalendar/delete/' + id, this._opt.getHeader());
  }
  getFactoryCalendarDetailList(data) {
    return this._httpSvc.post('factoryCalendar/detail/filter', data, this._opt.getHeader());
  }

  saveFactoryCalendarHoliday(data) {
    return this._httpSvc.post('factoryCalendar/detail/save', data, this._opt.getHeader());
  }
  getFactoryCalendarHoliday(id) {
    return this._httpSvc.post('factoryCalendar/detail/detail/' + id, {}, this._opt.getHeader());
  }
  deleteFactoryCalendarHoliday(factoryCalendarDetailId) {
    return this._httpSvc.delete('factoryCalendar/detail/delete/' + factoryCalendarDetailId, this._opt.getHeader());
  }

  update(data) {
    return this._httpSvc.post('workstation/update', data, this._opt.getHeader());
  }
  // not available in swagger
  updateWorkStationCapacity(data) {
    return this._httpSvc.post('workstation/update', data, this._opt.getHeader());
  }
  filter(data) {
    return this._httpSvc.post('workstation/filterworkstation', data, this._opt.getHeader());
  }

  filterObservable(data) {
    return this._httpShrdSvc.post('workstation/filterworkstation', data, this._opt.getHeader());
  }

  filterObservableList(data) {
    return this._httpSvc.post('workstation/filterworkstation', data, this._opt.getHeader());
  }

  getWorkStationsScheduleForWorkCenter(id, plantId) {
    return this._httpSvc.get(`workstation/schedule/${id}/${plantId}`, this._opt.getHeader());
  }
  getWorkStationsScheduleJobs(data) {
    return this._httpSvc.post(`workstation/scheduledJobs`, data, this._opt.getHeader());
  }
  getWorkStationsScheduleForWorkCenterIdOnly(id) {
    return this._httpSvc.get(`workstation/schedule/${id}`, this._opt.getHeader());
  }

  getMachineStatus(data) {
    return this._httpSvc.post('statisticallyReport/getMachineStatusReport', data, this._opt.getHeader());
  }

  getDailyMachineStatusOfWorkstation(data) {
    return this._httpSvc.post('workstation/dashboard/getDailyMachineStatusOfWorkstation', data, this._opt.getHeader());
  }

  getAnalysisOfWorkCenter(data) {
    return this._httpSvc.post('workstation/dashboard/getAnalysisOfWorkcenter', data, this._opt.getHeader());
  }
  filterWorkstationReport(data) {

    return this._httpSvc.post('workstation/workstationReport', data, this._opt.getHeader());
  }

  getWorkstationReportDetail(data) {

    return this._httpSvc.post(`workstation/workstationReportDetail`, data, this._opt.getHeader())
  }

  getWorkstationReportAvg(data) {
    return this._httpSvc.post(`workstation/workstationAvgReport`, data, this._opt.getHeader())
  }

  getWorkstationUnitList() { return this._httpShrdSvc.get('workstation/getWorkstationUnitList', this._opt.getHeader()).toPromise(); }

  saveWorkstarionUnit(data) {
    return this._httpSvc.post('workstation/saveWorkstationUnits', data, this._opt.getHeader());
  }

  getCategoryList() {
    return this._httpSvc.get('workstation/categoryList', this._opt.getHeader());

  }
  deleteCategory(id) {
    return this._httpSvc.delete('workstation/deleteWorkStationCategory/' + id, this._opt.getHeader());

  }
  getStandardKeyList() {
    return this._httpSvc.get('workstation/standartKeyList', this._opt.getHeader());
  }
  getStandardKeyParameterList() {
    return this._httpSvc.get('workstation/standartKeyParameterList', this._opt.getHeader());
  }

  getworkStationCapacityCategoryList() {
    return this._httpSvc.get('workstation/getworkStationCapacityCategoryList', this._opt.getHeader());
  }
  // getFactoryCalenderList() {
  //   return this._httpSvc.get('workstation/getFactoryCalenderList', this._opt.getHeader());
  // }
  getFactoryCalendarList(data) {
    return this._httpSvc.post('workstation/getFactoryCalendarList', data, this._opt.getHeader());
  }

  getChildrenWorkstationList(parentWorkstationId) {
    return this._httpSvc.get(`workstation/childrenWorkstationList/${parentWorkstationId}`, this._opt.getHeader());
  }

  getWorkstationComponentList(data) {
    return this._httpSvc.post('workstation/component/filter', data, this._opt.getHeader());
  }

  filterWorstationOperator(data) {
    return this._httpSvc.post('workstationOperator/filter', data, this._opt.getHeader());
  }
  updateWorkStationOperator(data) {
    return this._httpSvc.post('workstationOperator/updateWorkStationOperator', data, this._opt.getHeader());
  }

  filterWorkCenterCalendar(data) {
    return this._httpSvc.postObservable('workcenter/calendar/filter', data, this._opt.getHeader());
  }
  saveWorkCenterCalendar(data) {
    return this._httpSvc.post('workcenter/calendar/save', data, this._opt.getHeader());
  }

  deleteWorkCenterCalendar(id) {
    return this._httpSvc.delete('workcenter/calendar/delete/' + id, this._opt.getHeader());
  }
  detailWorkCenterCalendar(id) {
    return this._httpSvc.get('workcenter/calendar/detail/' + id, this._opt.getHeader());
  }



}
