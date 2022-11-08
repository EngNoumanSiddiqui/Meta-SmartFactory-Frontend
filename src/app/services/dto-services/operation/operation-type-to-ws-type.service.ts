import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class OperationTypeToWSTypeService extends BasePageService {
  saveAction$ = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('operationtype/workstationtype/delete/' + id, this._opt.getHeader()); }
  getDetails(id: string) { return this._httpSvc.get('operationtype/workstationtype/detail/' + id, this._opt.getHeader()); }
  save(data) { return this._httpSvc.post('operationtype/workstationtype/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('operationtype/workstationtype/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('operationtype/workstationtype/filter', data, this._opt.getHeader()); }
}
