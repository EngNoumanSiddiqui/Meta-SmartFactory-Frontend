import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class ScheduleReportService extends BasePageService {

    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
    }

    getScheduledMaterialReport(data) {
        return this._httpSvc.post('schedule/report/material', data, this._opt.getHeader());
    }

    getScheduledEmployeeReport(data) {
        return this._httpSvc.post('schedule/report/employee', data, this._opt.getHeader());
    }

    getScheduledWorkstationReport(data) {
        return this._httpSvc.post('schedule/report/workstation', data, this._opt.getHeader());
    }

    getWorkstationActualCapacityShiftReport(data) {
        return this._httpSvc.post('schedule/report/workstation/shift', data, this._opt.getHeader());
    }

    getEmployeeActualCapacityShiftReport(data) {
        return this._httpSvc.post('schedule/report/employee/shift', data, this._opt.getHeader());
    }
}

