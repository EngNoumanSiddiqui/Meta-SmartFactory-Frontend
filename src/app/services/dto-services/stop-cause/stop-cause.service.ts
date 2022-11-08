import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from '../../base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class StopCauseService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getIdNameList() { return this._httpSvc.get('stopCause/stopcauses', this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('stopCause/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('stopCause/detail/update/' + id, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('stopCause/deleteStopCause/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('stopCause/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('stopCause/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('stopCause/filterstopcauses', data, this._opt.getHeader()); }

}

