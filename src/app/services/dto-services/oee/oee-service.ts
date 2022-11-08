import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from '../../base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class OeeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }



  latestShiftOeeReport(data) { return this._httpSvc.post('oee/latestShiftOeeReport', data, this._opt.getHeader()); }


  getAverageOeeReport(data) { return this._httpSvc.post('oee/averageOeeReport', data, this._opt.getHeader()); }

  // getAverageDateIntervalOeeReport(data) { return this._httpSvc.post('oee/averageDateIntervalOeeReport', data, this._opt.getHeader()); }
  //
  //
  // getAverageOeeAllWorkstation(data) { return this._httpSvc.post('oee/averageOeeAllWorkstation', data, this._opt.getHeader()); }


  getOeeBetweenDate(data) { return this._httpSvc.post('oee/oeecommon', data, this._opt.getHeader()); }


  getOeeLogBetweenDate(data) { return this._httpSvc.post('oee/oeedetaillog', data, this._opt.getHeader()); }


  getOeeReport(data) { return this._httpSvc.post('oee/oeeReport', data, this._opt.getHeader()); }
  getOeeReport2(data) { return this._httpSvc.post('oee/oeeReport2', data, this._opt.getHeader()); }

  getAverageOeeReportJob(data) { return this._httpSvc.post('oee/averageOeeReportJob', data, this._opt.getHeader()); }
  getAverageOeeReportJobTrend(data) { return this._httpSvc.post('oee/averageOeeReportJobTrend', data, this._opt.getHeader()); }

  // getOeeReportDashboard(data) { return this._httpSvc.post('oee/oeeReportDashboard', data, this._opt.getHeader()); }
  getOeeReportDashboard(data) { return this._httpSvc.post('oee/oeeReportDashboard2', data, this._opt.getHeader()); }
}
