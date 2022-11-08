import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class SkillMatrixReportService extends BasePageService {

    constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
        super();
    }

    getSkillMatrixCategoryForWorkStation(data) {
        return this._httpSvc.post('skillMatrix/report/workStationCategory', data, this._opt.getHeader());
    }

    getSkillMatrixCategoryForEmployee(data) {
        return this._httpSvc.post('skillMatrix/report/employeeCategory', data, this._opt.getHeader());
    }

    getSkillMatrixCategoryForWorkStationMuri(data) {
        return this._httpSvc.post('skillMatrix/report/workStationCategory/muri', data, this._opt.getHeader());
    }

    getSkillMatrixCategoryForEmployeeMuri(data) {
        return this._httpSvc.post('skillMatrix/report/employeeCategory/muri', data, this._opt.getHeader());
    }

    getSkillMatrixCategoryForWorkStationMuda(data) {
        return this._httpSvc.post('skillMatrix/report/workStationCategory/muda', data, this._opt.getHeader());
    }

    getSkillMatrixCategoryForEmployeeMuda(data) {
        return this._httpSvc.post('skillMatrix/report/employeeCategory/muda', data, this._opt.getHeader());
    }

    getSkillMatrixCategoryForWorkStationMuriChart(data){
        return this._httpSvc.post('skillMatrix/report/workStationCategory/muriChart', data, this._opt.getHeader());
    }
}

