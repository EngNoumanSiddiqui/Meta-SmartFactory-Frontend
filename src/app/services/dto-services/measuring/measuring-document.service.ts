import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class MeasuringDocumentService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {

  }

  getDetail(id: string) {
    return this._httpSvc.get('equipment/Document/detail/' + id, this._opt.getHeader());
  }

  delete(id: string) {
    return this._httpSvc.delete('equipment/Document/delete/' + id, this._opt.getHeader());
  }

  save(data) {
    return this._httpSvc.post('equipment/Document/save', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('equipment/Document/filter', data, this._opt.getHeader());
  }

  filterObservable(data) {
    return this._httpSvc.postObservable('equipment/Document/filter', data, this._opt.getHeader());
  }

  getJobOrderOperationEquipmentSensorDataList(id: string) {
    return this._httpSvc.get('equipment/Document/measurement/' + id, this._opt.getHeader());
  }

  getEquipmentSensorDataList(data) {
    return this._httpSvc.post('equipment/Document/measurement/sensorData', data, this._opt.getHeader());
  }
}
