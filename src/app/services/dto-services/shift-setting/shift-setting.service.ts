/**
 * Created by reis on 19.11.2018.
 */
import {Injectable} from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class ShiftSettingsService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }
  saveShiftSettings(data) {
    return this._httpSvc.post('shift/saveShift', data, this._opt.getHeader());
  }
  updateShiftSettings(data) {
    return this._httpSvc.post('shift/update', data, this._opt.getHeader());
  }
  getShiftSettingsList() {
    return this._httpSvc.get('shift/shiftList', this._opt.getHeader());
  }
  getShiftDetail(shiftId) {
    return this._httpSvc.get('shift/detail/' + shiftId, this._opt.getHeader());
  }
  getShiftByPlantAndCurrentDate(plantId) {
    return this._httpSvc.get('shift/findByPlantPlantIdAndCurrentDate/' + plantId, this._opt.getHeader());
  }
  getShiftSettingsListByPlantId(plantId) {
    return this._httpSvc.get('shift/shiftList/' + plantId, this._opt.getHeader());
  }
  delete(id: string) { return this._httpSvc.delete('shift/deleteShift/' + id, this._opt.getHeader()); }
}

