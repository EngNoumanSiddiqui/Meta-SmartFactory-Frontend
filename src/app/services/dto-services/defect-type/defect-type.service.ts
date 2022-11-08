import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefectTypeService extends BasePageService {
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filterDefectType(data) { 
   return this._httpSvc.post('quality/defectType/filter', data, this._opt.getHeader()); 
 }

 detailDefectType(id: string) {
    return this._httpSvc.get('quality/defectType/detail/' + id, this._opt.getHeader()); 
 }

 saveDefectType(data) {
   return this._httpSvc.post('quality/defectType/save', data, this._opt.getHeader());
 }

 updateDefectType(data) {
   return this._httpSvc.post('quality/defectType/save', data, this._opt.getHeader());
 }

 deleteDefectType(id) {
   return this._httpSvc.delete('quality/defectType/delete/' + id, this._opt.getHeader());
 }


  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        defectTypeId: '1',
        defectTypeCode: '0011',
        description: 'ddddddd',
      },
      {
        defectTypeId: '2',
        defectTypeCode: '0022',
        description: 'ddddddd',
      },
      {
        defectTypeId: '3',
        defectTypeCode: '0033',
        description: 'ddddddd',
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.defectTypeId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.defectTypeId === id);
    this.records.content[index].defectTypeCode = data.defectTypeCode;
    this.records.content[index].description = data.description;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.defectTypeId != id
    );
    return of(this.records);
  }

  save(item) {
    item.defectTypeId = Math.floor(Math.random() * 1000);
    item.status = 'ready';
    this.records.content.push(item);
    return of(this.records);
  }
}
 