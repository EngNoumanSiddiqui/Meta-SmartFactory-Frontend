import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from '../../base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class StopService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  employeeWorkstationsStops(data) { return this._httpSvc.post('workstationOperator/employeeWorkAnalyse', data, this._opt.getHeader()); }


  employeeStopReasons(data) { return this._httpSvc.post('workstationOperator/employeeStopAnalyse', data, this._opt.getHeader()); }

  allEmployeeWorkstationsStops(data) { return this._httpSvc.post('workstationOperator/allEmployeeWorkAnalyse', data, this._opt.getHeader()); }

  getAllWorkStopsPercentage() {
    return this._httpSvc.get('stop/all',  this._opt.getHeader());
  }
  getAllWorkStopsPlantIdPercentage(plantId) {
    return this._httpSvc.get('stop/all/' + plantId,  this._opt.getHeader());
  }

  filter(data) { return this._httpSvc.post('stop/filter', data, this._opt.getHeader()); }
  filterObs(data) { return this._httpSvc.postObservable('stop/filter', data, this._opt.getHeader()); }
  
  panelCustomsStops(data) { return this._httpSvc.post('panel/stop/filter/custom', data, this._opt.getHeader()); }
  customsStops(data) { return this._httpSvc.post('stop/filter/custom', data, this._opt.getHeader()); }
  customsStopsObs(data) { return this._httpSvc.postObservable('stop/filter/custom', data, this._opt.getHeader()); }

  getMachineStateStops(data) { return this._httpSvc.post('stop/machine-state', data, this._opt.getHeader()); }

  workstationShiftStop(data) { return this._httpSvc.post('stop/filter/ws/shift', data, this._opt.getHeader()); }
}

