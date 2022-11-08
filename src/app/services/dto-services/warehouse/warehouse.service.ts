import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class WarehouseService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getIdNameList() { return this._httpSvc.get('warehouse/warehouses', this._opt.getHeader()); }


  save(data) { return this._httpSvc.post('warehouse/save', data, this._opt.getHeader()); }


  delete(id: string) { return this._httpSvc.delete('warehouse/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('warehouse/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('warehouse/detail/update/' + id, this._opt.getHeader()); }


  update(data) { return this._httpSvc.post('warehouse/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('warehouse/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('warehouse/filter', data, this._opt.getHeader()); }

  filterStock(data) { return this._httpSvc.post('warehouse/filterStock', data, this._opt.getHeader()); }


}
