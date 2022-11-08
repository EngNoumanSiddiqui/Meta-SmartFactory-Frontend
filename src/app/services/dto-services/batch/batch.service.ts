/**
 * Created by reis on 11.06.2019.
 */
import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class BatchService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  getDetail(id: string) { return this._httpSvc.get('batch/batchdetailbyid/' + id, this._opt.getHeader()); }
  getDetailWithBatchCode(code: string) { return this._httpSvc.get('batch/batchdetailbycode/' + code, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('act/detail/update/' + id, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.get('batch/cancel/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('batch/save', data, this._opt.getHeader()); }
  autosave(data) { return this._httpSvc.post('batch/autosave', data, this._opt.getHeader()); }

  getNewBarCode(type) {
    return this._httpSvc.get('batch/getNewbarcode/'+type, this._opt.getTextHeader());
  }
  update(data) { return this._httpSvc.post('batch/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('batch/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('batch/filter', data, this._opt.getHeader()); }


}
