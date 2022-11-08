import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class MeasuringUnitService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  save(data) { return this._httpSvc.post('measuringUnit/save', data, this._opt.getHeader()); }


  delete(id: string) { return this._httpSvc.delete('measuringUnit/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('measuringUnit/detail/' + id, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('measuringUnit/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('measuringUnit/filter', data, this._opt.getHeader()); }

  getMeasuringUnitList() {
    return this._httpSvc.get('MeasureUnitTypeEnum', this._opt.getHeader()); 
  }
}
