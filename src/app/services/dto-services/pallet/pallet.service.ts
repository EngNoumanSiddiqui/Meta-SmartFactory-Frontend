import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class PalletService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  filterObservable(data) { return this._httpSvc.postObservable('pallet/filter', data, this._opt.getHeader()); }

  pushPalletToErp(id: string) {return this._httpSvc.get('pallet/pushPalletToErp/' + id, this._opt.getHeader());}
  getDetails(id: string) { return this._httpSvc.get('pallet/detail/' + id, this._opt.getHeader()); }
  save(data) { return this._httpSvc.post('pallet/save', data , this._opt.getHeader()); }

}
