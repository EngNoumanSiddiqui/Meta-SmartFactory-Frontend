import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class SamplingProcedureService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterSamplingProcedure(data) { 
    return this._httpSvc.post('quality/samplingProcedure/filter', data, this._opt.getHeader()); 
  }
  filterSamplingProcedureObservable(data) { 
    return this._httpSvc.postObservable('quality/samplingProcedure/filter', data, this._opt.getHeader()); 
  }

  detailSamplingProcedure(id: string) {
     return this._httpSvc.get('quality/samplingProcedure/detail/' + id, this._opt.getHeader()); 
  }

  saveSamplingProcedure(data) {
    return this._httpSvc.post('quality/samplingProcedure/save', data, this._opt.getHeader());
  }

  updateSamplingProcedure(data) {
    return this._httpSvc.post('quality/samplingProcedure/save', data, this._opt.getHeader());
  }

  deleteSamplingProcedure(id) {
    return this._httpSvc.delete('/quality/samplingProcedure/delete/' + id, this._opt.getHeader());
  }

  // new model
  // ResponseQualitySamplingProcedureDto{
  //   acceptance	integer($int32)
  //   createDate	string($date-time)
  //   indicatorCharacteristicSampleList	[...]
  //   inspectionCharacteristicOperationList	[...]
  //   inspectionLotResultRecordingList	[...]
  //   qualityCharacteristicOperationList	[...]
  //   sampleSize	integer($int32)
  //   samplingProcedureCode	string
  //   samplingProcedureId	integer($int32)
  //   samplingProcedureInspectionPoint	QualitySamplingProcedureInspectionPointDto{...}
  //   samplingProcedureName	string
  //   samplingProcedureUsageIndicator	QualitySamplingProcedureUsageIndicatorDto{...}
  //   samplingProcedureValuationMode	QualitySamplingProcedureValuationModeDto{...}
  //   samplingType	QualitySamplingTypeDto{...}
  //   updateDate	string($date-time)
  // }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        samplingProcedureId: '1',
        samplingProcedureCode: '0011',
        samplingProcedure: null,
        samplingType: null,
        valuationMode: null,
        inspectionPoints: null,
        usageIndicator: null,
        sampleSize: null,
        acceptanceNumber: null,
        createdDate: new Date('2013,10,30')
      },
      {
        samplingProcedureId: '2',
        samplingProcedureCode: '0022',
        samplingProcedure: null,
        samplingType: null,
        valuationMode: null,
        inspectionPoints: null,
        usageIndicator: null,
        sampleSize: null,
        acceptanceNumber: null,
        createdDate: new Date('2012,10,30')
      },
      {
        samplingProcedureId: '3',
        samplingProcedureCode: '0033',
        samplingProcedure: null,
        samplingType: null,
        valuationMode: null,
        inspectionPoints: null,
        usageIndicator: null,
        sampleSize: null,
        acceptanceNumber: null,
        createdDate: new Date('2011,10,30')
      }
    ]
  };

  getAll() {
    this.records.content.sort((a, b) => (a.createdDate < b.createdDate) ? 1 : -1);
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.samplingProcedureId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.samplingProcedureId === id);
    this.records.content[index].samplingProcedureCode = data.samplingProcedureCode;
    this.records.content[index].samplingProcedure = data.samplingProcedure;
    this.records.content[index].samplingType = data.samplingType;
    this.records.content[index].valuationMode = data.valuationMode;
    this.records.content[index].inspectionPoints = data.inspectionPoints;
    this.records.content[index].usageIndicator = data.usageIndicator;
    this.records.content[index].sampleSize = data.sampleSize;
    this.records.content[index].acceptanceNumber = data.acceptanceNumber;
    this.records.content[index].createdDate = data.createdDate;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.samplingProcedureId != id
    );
    return of(this.records);
  }

  save(item) {
    item.samplingProcedureId = Math.floor(Math.random() * 1000);
    item.createdDate = new Date();
    this.records.content.unshift(item);
    return of(this.records);
  }
}
