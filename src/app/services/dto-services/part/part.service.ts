import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class PartService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('part/deletePart/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('part/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string)
   { return this._httpSvc.get('part/detail/update/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('part/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('part/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('part/filterPart', data, this._opt.getHeader()); }

}
