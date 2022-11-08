import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable({
  providedIn: 'root'
})

export class PalletStockSettingsService extends BasePageService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }


  save(data) { return this._httpSvc.post('palletSetting/stock/save', data, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('palletSetting/stock/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('palletSetting/stock/detail/' + id, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('palletSetting/stock/filter', data, this._opt.getHeader()); }
  
  filterObservable(data) { return this._httpSvc.postObservable('palletSetting/stock/filter', data, this._opt.getHeader()); }


}
