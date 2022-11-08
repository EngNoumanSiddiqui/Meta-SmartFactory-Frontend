import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class PowerConsumptionService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }


  jobOrderConsumption(data) {
    return this._httpSvc.post('jobOrder/filterPowerAnalise', data, this._opt.getHeader());
  }

  filterWorkStationPowerConsumption(data) {
    return this._httpSvc.post('power-consumption/workStationPowerAnalise', data, this._opt.getHeader());

  }

  filterAllWorkStationPowerConsumption(data) {
    return this._httpSvc.post('power-consumption/workStationAllPowerAnalise', data, this._opt.getHeader());

  }
  powerConsumptionSettingsSave(data) {
    return this._httpSvc.post('tariff/save', data, this._opt.getHeader());
  }
  getPowerConsuptionSetting() {
    return this._httpSvc.get('tariff/getDetail', this._opt.getHeader());
  }
}

