import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class WorkstationDashboardService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  getMachineStatusOfWorkstation(data) {
    return this._httpSvc.post('workstation/dashboard/getMachineStatusOfWorkstation', data, this._opt.getHeader());
  }

  getOeeLostOfShifts(data) {
    return this._httpSvc.post('workstation/dashboard/getOeeLostOfShifts', data, this._opt.getHeader());
  }

  getOeeOfWorkstations(data) {
    return this._httpSvc.post('workstation/dashboard/getOeeOfWorkstations', data, this._opt.getHeader());
  }

  getProductionAnalysis(data) {
    return this._httpSvc.post('workstation/dashboard/getProductionAnalysis', data, this._opt.getHeader());
  }
  getJobOrderQantities(data) {
    return this._httpSvc.post('workstation/dashboard/getJobOrderQantities', data, this._opt.getHeader());
  }

  getProductionStatusOfWorkstation(data){
    return this._httpSvc.post('workstation/dashboard/getProductionStatusOfWorkstation', data, this._opt.getHeader());
  }


}
