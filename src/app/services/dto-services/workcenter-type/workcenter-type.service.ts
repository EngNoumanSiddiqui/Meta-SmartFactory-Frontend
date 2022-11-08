import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class WorkcenterTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  update(data) { return this._httpSvc.post('workcentertype/update', data, this._opt.getHeader()); }
  delete(id) { return this._httpSvc.delete('workcentertype/delete/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('workcentertype/save', data, this._opt.getHeader()); }

  getIdNameList() { return this._httpSvc.get('workcentertype/workcentertypes', this._opt.getHeader()); }
  getWorkCentreTypeByPlantId(id) { return this._httpSvc.get('workcentertype/workcentertypes/' + id, this._opt.getHeader()); }

}
