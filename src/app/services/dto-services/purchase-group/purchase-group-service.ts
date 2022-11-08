import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { of } from 'rxjs';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable({
  providedIn: 'root'
})

export class PurchaseGroupService extends BasePageService {

  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  get(id: string) { return this._httpSvc.get('purchase/group/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('purchase/group/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('purchase/group/filter', data, this._opt.getHeader()); }
  
  filterObservable(data) { return this._httpSvc.post('purchase/group/filter', data, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('purchase/group/delete/' + id, this._opt.getHeader()); }
  
}
