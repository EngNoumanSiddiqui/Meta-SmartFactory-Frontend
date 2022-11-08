/**
 * Created by reis on 30.07.2019.
 */
import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class ProductTreeEquipmentService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('productTreeDetail/equipment/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('productTreeDetail/equipment/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('productTreeDetail/equipment/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('productTreeDetail/equipment/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('productTreeDetail/equipment/filter', data, this._opt.getHeader()); }
}
