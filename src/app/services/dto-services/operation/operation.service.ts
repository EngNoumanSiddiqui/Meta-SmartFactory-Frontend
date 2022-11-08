import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';
import { Subject } from 'rxjs';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class OperationService extends BasePageService {
  saveAction$ = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService,
    private _httpShared: ShareHttpCallsService ) {
    super();
  }

  getIdNameList() { return this._httpSvc.get('operation/operations/', this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('operation/detail/' + id, this._opt.getHeader()); }

  getOrderDetail(id: string) { return this._httpSvc.get('operation/detail/' + id+'/true', this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('operation/detail/update/' + id, this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('operation/deleteOperation/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('operation/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('operation/update', data, this._opt.getHeader()); }
  deleteWorkstationOperation(workstationOperationId ) {
    return this._httpSvc.get('operation/delete/workstationOperation/' + workstationOperationId , this._opt.getHeader());
  }

  filter(data) { return this._httpSvc.post('operation/filteroperation', data, this._opt.getHeader()); }


  filterObservable(data, skipCache: boolean = false) { return this._httpShared.post('operation/filteroperation', data, this._opt.getHeader(), skipCache); }


  operationTypedelete(id: string) { return this._httpSvc.delete('operationType/delete/' + id, this._opt.getHeader()); }

  operationTypesave(data) { return this._httpSvc.post('operationType/save', data, this._opt.getHeader()); }

  operationTypefilter() { return this._httpSvc.get('operationType/list', this._opt.getHeader()); }
  getDetailByPlantId(id: string) { return this._httpSvc.get('operationType/list/' + id, this._opt.getHeader()); }


}
