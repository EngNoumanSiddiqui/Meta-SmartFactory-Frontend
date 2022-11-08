import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class MeasuringPointService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {

  }

  getDetail(id: string) {
    return this._httpSvc.get('equipment/measuringPoint/detail/' + id, this._opt.getHeader());
  }

  delete(id: string) {
    return this._httpSvc.delete('equipment/measuringPoint/delete/' + id, this._opt.getHeader());
  }

  save(data) {
    return this._httpSvc.post('equipment/measuringPoint/save', data, this._opt.getHeader());
  }

  filter(data) {
    return this._httpSvc.post('equipment/measuringPoint/filter', data, this._opt.getHeader());
  }

  filterObservable(data) {
    return this._httpSvc.postObservable('equipment/measuringPoint/filter', data, this._opt.getHeader());
  }

}
