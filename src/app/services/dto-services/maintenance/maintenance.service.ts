import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class MaintenanceService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/deleteMaintenance/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('maintenance/detail/update/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('maintenance/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/filterMaintenance', data, this._opt.getHeader()); }

}
