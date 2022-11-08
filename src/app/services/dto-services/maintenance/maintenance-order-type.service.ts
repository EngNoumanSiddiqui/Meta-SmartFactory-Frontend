import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class MaintenanceOrderTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/ordertype/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/ordertype/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/ordertype/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/ordertype/filter', data, this._opt.getHeader()); }

}
