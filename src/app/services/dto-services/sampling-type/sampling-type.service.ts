import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SamplingTypeService extends BasePageService {
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filterSamplingType(data) { 
   return this._httpSvc.post('quality/samplingType/filter', data, this._opt.getHeader()); 
 }

 detailSamplingType(id: string) {
    return this._httpSvc.get('quality/samplingType/detail/' + id, this._opt.getHeader()); 
 }

 saveSamplingType(data) {
   return this._httpSvc.post('quality/samplingType/save', data, this._opt.getHeader());
 }

 updateSamplingType(data) {
   return this._httpSvc.post('quality/samplingType/save', data, this._opt.getHeader());
 }

 deleteSamplingType(id) {
   return this._httpSvc.delete('/quality/samplingType/delete/' + id, this._opt.getHeader());
 }


  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        samplingTypeId: '1',
        samplingTypeCode: '0011',
        description: 'ddddddd',
      },
      {
        samplingTypeId: '2',
        samplingTypeCode: '0022',
        description: 'ddddddd',
      },
      {
        samplingTypeId: '3',
        samplingTypeCode: '0033',
        description: 'ddddddd',
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.samplingTypeId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.samplingTypeId === id);
    this.records.content[index].samplingTypeCode = data.samplingTypeCode;
    this.records.content[index].description = data.description;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.samplingTypeId != id
    );
    return of(this.records);
  }

  save(item) {
    item.samplingTypeId = Math.floor(Math.random() * 1000);
    item.status = 'ready';
    this.records.content.push(item);
    return of(this.records);
  }
}
