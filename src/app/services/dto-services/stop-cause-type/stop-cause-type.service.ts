import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class StopCauseTypeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getIdNameList() { return this._httpSvc.get('stopcausetype/stopcausetypes', this._opt.getHeader()); }
  getIdNameListByPlant(plantId) { return this._httpSvc.get('stopcausetype/stopcausetypes/' + plantId, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('stopcausetype/update', data, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('stopcausetype/save', data, this._opt.getHeader()); }

  getDetail(id) {
    return this._httpSvc.get('stopcausetype/detail/' + id, this._opt.getHeader());
  }
}
