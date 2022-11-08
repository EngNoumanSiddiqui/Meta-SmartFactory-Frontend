import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class WorkstationTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }


  update(data) { return this._httpSvc.post('workstationtype/update', data, this._opt.getHeader()); }

  delete(id) { return this._httpSvc.delete('workstationtype/delete/'+id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('workstationtype/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('workstationtype/filter', data, this._opt.getHeader()); }

  getIdNameList() { return this._httpSvc.get('workstationtype/workstationtypes', this._opt.getHeader()); }

}
