import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultRecordingService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterResultRecording(data) { 
    return this._httpSvc.post('quality/inspectionLotResultRecording/filter', data, this._opt.getHeader()); 
  }
  filterResultRecordingObservable(data) { 
    return this._httpSvc.postObservable('quality/inspectionLotResultRecording/filter', data, this._opt.getHeader()); 
  }

  detailResultRecording(id: string) {
     return this._httpSvc.get('quality/inspectionLotResultRecording/detail/' + id, this._opt.getHeader()); 
  }

  saveResultRecording(data) {
    return this._httpSvc.post('quality/inspectionLotResultRecording/save', data, this._opt.getHeader());
  }

  updateResultRecording(data) {
    return this._httpSvc.post('quality/inspectionLotResultRecording/save', data, this._opt.getHeader());
  }

  deleteResultRecording(id) {
    return this._httpSvc.delete('quality/inspectionLotResultRecording/delete/' + id, this._opt.getHeader());
  }
// new model
// RequestCreateQualityInspectionLotResultRecordingDto{
//   createDate	string($date-time)
//   inspect	integer($int32)
//   inspected	integer($int32)
//   inspectionCharacteristicShortText	string
//   inspectionlotResultRecordingCode	string
//   inspectionlotResultRecordingId	integer($int32)
//   qualityInspectionCharacteristicId	integer($int32)
//   qualityInspectionLotId	integer($int32)
//   qualitySamplingProcedureId	integer($int32)
//   result	string
//   specifications	string
//   updateDate	string($date-time)
// }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        resultRecordingId: '1',
        inspectionCharacteristic: "Insp Char 1",
        recordType: 'Record Type 1',
        specifications: 'Specification 1',
        inspect: 'Inspect 1',
        inspected: null,
        result: null,
        defect: null,
        attribute: null,
        inspectionDescription: null,
        valuation: null
      },
      {
        resultRecordingId: '2',
        inspectionCharacteristic: "Insp Char 2",
        recordType: 'Record Type 2',
        specifications: 'Specification 2',
        inspect: 'Inspect 2',
        inspected: null,
        result: null,
        defect: null,
        attribute: null,
        inspectionDescription: null,
        valuation: null
      },
      {
        resultRecordingId: '3',
        inspectionCharacteristic: "Insp Char 3",
        recordType: 'Record Type 2',
        specifications: 'Specification 3',
        inspect: 'Inspect 3',
        inspected: null,
        result: null,
        defect: null,
        attribute: null,
        inspectionDescription: null,
        valuation: null
      },
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.resultRecordingId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.resultRecordingId === id);
    this.records.content[index].inspectionCharacteristic = data.inspectionCharacteristic;
    this.records.content[index].specifications = data.specifications;
    this.records.content[index].recordType = data.recordType;
    this.records.content[index].inspect = data.inspect;
    this.records.content[index].inspected = data.inspected;
    this.records.content[index].result = data.result;
    this.records.content[index].defect = data.defect;
    this.records.content[index].attribute = data.attribute;
    this.records.content[index].inspectionDescription = data.inspectionDescription;
    this.records.content[index].valuation = data.valuation;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.resultRecordingId != id
    );
    return of(this.records);
  }

  save(item) {
    item.resultRecordingId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
 