import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { of } from 'rxjs';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable({
  providedIn: 'root'
})
export class ValuationModeService extends BasePageService {

  constructor(
    private _httpSvc: HttpControllerService, private _opt: OptionService
  ) {
    super();
  }
  get(id: string) { return this._httpSvc.get('quality/samplingProcedureValuationMode/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('quality/samplingProcedureValuationMode/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('quality/samplingProcedureValuationMode/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.post('quality/samplingProcedureValuationMode/filter', data, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('quality/samplingProcedureValuationMode/delete/' + id, this._opt.getHeader()); }
}
