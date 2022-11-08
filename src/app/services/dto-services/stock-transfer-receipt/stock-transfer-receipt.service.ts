import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class StockTransferReceiptService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  cancelDetailItem(id) { return this._httpSvc.get('stocktransferreceipt/cancel/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('stocktransferreceipt/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('stocktransferreceipt/save', data, this._opt.getHeader()); }

  

  update(data) { return this._httpSvc.post('stocktransferreceipt/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('stocktransferreceipt/filterstocktransferreceipt', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('stocktransferreceipt/filterstocktransferreceipt', data, this._opt.getHeader()); }
  filterDetailsObservable(data) { return this._httpSvc.postObservable('stocktransferreceipt/filterstocktransferreceipt/items', data, this._opt.getHeader()); }



}
