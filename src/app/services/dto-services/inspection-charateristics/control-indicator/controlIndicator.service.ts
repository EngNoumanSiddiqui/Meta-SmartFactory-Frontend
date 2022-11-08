import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class ControlIndicatorService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterControlIndicator(data) { 
    return this._httpSvc.post('quality/controlIndicator/filter', data, this._opt.getHeader()); 
  }

  detailControlIndicator(id: string) {
     return this._httpSvc.get('quality/controlIndicator/detail/' + id, this._opt.getHeader()); 
  }

  saveControlIndicator(data) {
    return this._httpSvc.post('quality/controlIndicator/save', data, this._opt.getHeader());
  }

  updateControlIndicator(data) {
    return this._httpSvc.post('quality/controlIndicator/save', data, this._opt.getHeader());
  }

  deleteControlIndicator(id) {
    return this._httpSvc.delete('/quality/controlIndicator/delete/' + id, this._opt.getHeader());
  }
// new model
  // RequestCreateQualityCharacteristicControlIndicatorDto{
  //   characteristicControlIndicatorCode	string
  //   characteristicControlIndicatorId	integer($int32)
  //   createDate	string($date-time)
  //   qualityControlIndicatorResultId	integer($int32)
  //   qualityControlIndicatorSampleId	integer($int32)
  //   qualityControlIndicatorTypeId	integer($int32)
  //   qualityInspectionCharacteristicId	integer($int32)
  //   updateDate	string($date-time)
  // }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        controlIndicatorId: '1',
        controlIndicatorCode: '0011',
        controlIndicatorType: null,
        controlIndicatorSample: null,
        controlIndicatorResult: null,
        defectRecording: null
      },
      {
        controlIndicatorId: '2',
        controlIndicatorCode: '0022',
        controlIndicatorType: null,
        controlIndicatorSample: null,
        controlIndicatorResult: null,
        defectRecording: null
      },
      {
        controlIndicatorId: '3',
        controlIndicatorCode: '0033',
        controlIndicatorType: null,
        controlIndicatorSample: null,
        controlIndicatorResult: null,
        defectRecording: null
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.controlIndicatorId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.controlIndicatorId === id);
    this.records.content[index].controlIndicatorCode = data.controlIndicatorCode;
    this.records.content[index].controlIndicatorType = data.controlIndicatorType;
    this.records.content[index].controlIndicatorSample = data.controlIndicatorSample;
    this.records.content[index].controlIndicatorResult = data.controlIndicatorResult;
    this.records.content[index].defectRecording = data.defectRecording;
    return of(this.records);
  }

  delete(id: string) {
    console.log("service id:", id)
    this.records.content = this.records.content.filter(
      obj => obj.controlIndicatorId != id
    );
    return of(this.records);
  }

  save(item) {
    item.controlIndicatorId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(this.records);
  }
}
