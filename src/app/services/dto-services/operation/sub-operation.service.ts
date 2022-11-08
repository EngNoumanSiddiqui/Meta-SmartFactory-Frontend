import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class SubOperationService extends BasePageService {
  saveAction$ = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  getDetail(id: string) { return this._httpSvc.get('operation/subOperation/detail/' + id, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('operation/subOperation/delete/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('operation/subOperation/save', data, this._opt.getHeader()); }
  updateSubOperationTotalSkillValue(data) { return this._httpSvc.post('operation/subOperation/updateSubOperationTotalSkillValue', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('operation/subOperation/filter', data, this._opt.getHeader()); }

  filterObservable(data) { return this._httpSvc.postObservable('operation/subOperation/filter', data, this._opt.getHeader()); }
}
