/**
 * Created by reis on 30.07.2019.
 */
import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class JobOrderComponentFetaureService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('joborder/stock/componentFeature/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('joborder/stock/componentFeature/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('joborder/stock/componentFeature/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('joborder/stock/componentFeature/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('joborder/stock/componentFeature/filter', data, this._opt.getHeader()); }
}
