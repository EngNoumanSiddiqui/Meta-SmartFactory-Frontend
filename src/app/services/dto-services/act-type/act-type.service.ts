import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from 'app/services/core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class ActTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }


  getbyPlantId(plantId) { return this._httpSvc.get('acttype/acttypes/' + plantId, this._opt.getHeader()); }
  getbyPlantId_AccountPosition(plantId, accountPosition) { return this._httpSvc.get('acttype/acttypes/' + plantId + '/' + accountPosition , this._opt.getHeader()); }
  delete(id) { return this._httpSvc.get('acttype/delete/' + id, this._opt.getHeader()); }
  getIdNameList() { return this._httpSvc.get('acttype/acttypes', this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('acttype/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('acttype/update', data, this._opt.getHeader()); }
}
