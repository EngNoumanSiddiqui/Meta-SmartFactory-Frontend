import { Injectable } from '@angular/core';
import { BasePageService } from 'app/services/base/base-page.service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable({
  providedIn: 'root'
})
export class SimulationReportService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

trendAllWorkstationActualCapacitySimulation(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendAllWorkstationActualCapacitySimulation', data, this._opt.getHeader()); }
trendWorkstationActualCapacityByPlantReportSimulation(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendWorkstationActualCapacityByPlantReportSimulation', data, this._opt.getHeader()); }
trendWorkstationActualCapacityByPlantSimulation(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendWorkstationActualCapacityByPlantSimulation', data, this._opt.getHeader()); }
trendWorkstationActualCapacitySimulation(data) { return this._httpSvc.postObservable('datawarehouse/stock/report/trendWorkstationActualCapacitySimulation', data, this._opt.getHeader()); }


}
