import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class WarehouseLocationService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }



  save(data) { return this._httpSvc.post('warehouseLocation/save', data, this._opt.getHeader()); }


  delete(id: string) { return this._httpSvc.delete('warehouseLocation/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('warehouseLocation/detail/' + id, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('warehouseLocation/filter', data, this._opt.getHeader()); }
filterObservable(data) { return this._httpSvc.postObservable('warehouseLocation/filter', data, this._opt.getHeader()); }


}
