import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class InvoiceService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  detail(id) { return this._httpSvc.get('invoice/detail/'+ id, this._opt.getHeader())}
  delete(id) { return this._httpSvc.delete('invoice/delete/'+id, this._opt.getHeader()); }
  save(data) { return this._httpSvc.post('invoice/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('invoice/filter', data, this._opt.getHeader()); }
  filterObs(data) { return this._httpSvc.postObservable('invoice/filter', data, this._opt.getHeader()); }

}
