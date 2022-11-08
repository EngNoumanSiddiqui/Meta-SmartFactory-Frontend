import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class StockTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('stocktype/deleteStock/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('stocktype/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('stocktype/detail/update/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('stocktype/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('stocktype/update', data, this._opt.getHeader()); }

  getIdNameList() { return this._httpSvc.get('stocktype/stocktypes', this._opt.getHeader()); }

}
