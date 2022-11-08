import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionOperationsService extends BasePageService { 
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filterInspectionOperation(data) { 
   return this._httpSvc.post('quality/inspectionOperation/filter', data, this._opt.getHeader()); 
 }

 detailInspectionOperation(id: string) {
    return this._httpSvc.get('quality/inspectionOperation/detail/' + id, this._opt.getHeader()); 
 }

 saveInspectionOperation(data) {
   return this._httpSvc.post('quality/inspectionOperation/save', data, this._opt.getHeader());
 }

 updateInspectionOperation(data) {
   return this._httpSvc.post('quality/inspectionOperation/save', data, this._opt.getHeader());
 }

 deleteInspectionOperation(id) {
   return this._httpSvc.delete('/quality/inspectionOperation/delete/' + id, this._opt.getHeader());
 }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        inspectionOperationId: '1',
        inspectionOperationCode: '0011',
        inspectionOperationName: 'Operation 1',
        description: 'descriptions',
      },
      {
        inspectionOperationId: '2',
        inspectionOperationCode: '0022',
        inspectionOperationName: 'Operation 2',
        description: 'descriptions',
      },
      {
        inspectionOperationId: '3',
        inspectionOperationCode: '0033',
        inspectionOperationName: 'Operation 3',
        description: 'descriptions',
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.inspectionOperationId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.inspectionOperationId === id);
    this.records.content[index].inspectionOperationCode = data.inspectionOperationCode;
    this.records.content[index].inspectionOperationName = data.inspectionOperationName;
    this.records.content[index].description = data.description;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.inspectionOperationId != id
    );
    return of(this.records);
  }

  save(item) {
    item.inspectionOperationId = Math.floor(Math.random() * 1000);
    item.status = 'ready';
    this.records.content.push(item);
    return of(this.records);
  }
}
