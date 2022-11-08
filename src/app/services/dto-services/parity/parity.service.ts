import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';
import { BasePageService } from 'app/services/base/base-page.service';

@Injectable()
export class ParityService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('parity/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('parity/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('parity/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('parity/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('parity/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('parity/filter', data, this._opt.getHeader()); }
}
