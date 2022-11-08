import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class StockStrategyService extends BasePageService {
  public saveStockStrategyAction$: Subject<any> = new Subject();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  

  delete(id: string) { return this._httpSvc.delete('stockStrategy/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('stockStrategy/detail/' + id, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('stockStrategy/filter', data, this._opt.getHeader()); }
  save(data) { return this._httpSvc.post('stockStrategy/save', data, this._opt.getHeader()); }
  saveAll(data) { return this._httpSvc.post('stockStrategy/saveAll', data, this._opt.getHeader()); }

}
