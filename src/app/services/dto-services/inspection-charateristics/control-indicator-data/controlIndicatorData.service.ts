import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class ControlIndicatorDataService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterControlIndicatorData(data) { 
    return this._httpSvc.post('quality/controlIndicatorData/filter', data, this._opt.getHeader()); 
  }

  detailControlIndicatorData(id: string) {
     return this._httpSvc.get('quality/controlIndicatorData/detail/' + id, this._opt.getHeader()); 
  }

  saveControlIndicatorData(data) {
    return this._httpSvc.post('quality/controlIndicatorData/save', data, this._opt.getHeader());
  }

  updateControlIndicatorData(data) {
    return this._httpSvc.post('quality/controlIndicatorData/save', data, this._opt.getHeader());
  }

  deleteControlIndicatorData(id) {
    return this._httpSvc.delete('/quality/controlIndicatorData/delete/' + id, this._opt.getHeader());
  }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        contIndiId: '1',
        code: '0011',
        decimalPlaces: null,
        measurementUnit: null,
        lowerSpecificLimit: null,
        upperLimit: null,
        targetValue: null,
      },
      {
        contIndiId: '2',
        code: '0022',
        decimalPlaces: null,
        measurementUnit: null,
        lowerSpecificLimit: null,
        upperLimit: null,
        targetValue: null,
      },
      {
        contIndiId: '3',
        code: '0033',
        decimalPlaces: null,
        measurementUnit: null,
        lowerSpecificLimit: null,
        upperLimit: null,
        targetValue: null,
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.contIndiId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.contIndiId === id);
    this.records.content[index].code = data.code;
    this.records.content[index].decimalPlaces = data.decimalPlaces;
    this.records.content[index].measurementUnit = data.measurementUnit;
    this.records.content[index].lowerSpecificLimit = data.lowerSpecificLimit;
    this.records.content[index].upperLimit = data.upperLimit;
    this.records.content[index].targetValue = data.targetValue;
    return of(this.records);
  }

  delete(id: string) {
    console.log("service id:", id)
    this.records.content = this.records.content.filter(
      obj => obj.contIndiId != id
    );
    return of(this.records);
  }

  save(item) {
    console.log('chek Save item', item);
    
    item.contIndiId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(this.records);
  }
}
