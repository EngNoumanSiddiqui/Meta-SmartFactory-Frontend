import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefectRecordingService extends BasePageService {
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
       super();
 }

 filterDefectRecording(data) { 
   return this._httpSvc.post('quality/defectRecording/filter', data, this._opt.getHeader()); 
 }
 filterDefectRecordingObservable(data) { 
  return this._httpSvc.postObservable('quality/defectRecording/filter', data, this._opt.getHeader()); 
}

 detailDefectRecording(id: string) {
    return this._httpSvc.get('quality/defectRecording/detail/' + id, this._opt.getHeader()); 
 }

 saveDefectRecording(data) {
   return this._httpSvc.post('quality/defectRecording/save', data, this._opt.getHeader());
 }

 updateDefectRecording(data) {
   return this._httpSvc.post('quality/defectRecording/save', data, this._opt.getHeader());
 }

 deleteDefectRecording(id) {
   return this._httpSvc.delete('quality/defectRecording/delete/' + id, this._opt.getHeader());
 }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        defectRecordingId: '1',
        inspectionCharacteristic: null,
        reportType: 'Report Type 1',
        catalog: 'Catalog 1',
        codeGroup: 'Code Group 1',
        defectType: 'Defect Type 1',
        inspector: null,
        shortText: null,
      },
      {
        defectRecordingId: '2',
        inspectionCharacteristic: null,
        reportType: 'Report Type 1',
        catalog: 'Catalog 1',
        codeGroup: 'Code Group 1',
        defectType: 'Defect Type 1',
        inspector: null,
        shortText: null,
      },
      {
        defectRecordingId: '3',
        inspectionCharacteristic: null,
        reportType: 'Report Type 1',
        catalog: 'Catalog 1',
        codeGroup: 'Code Group 1',
        defectType: 'Defect Type 1',
        inspector: null,
        shortText: null,
      },
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.defectRecordingId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.defectRecordingId === id);
    this.records.content[index].inspectionCharacteristic = data.inspectionCharacteristic;
    this.records.content[index].reportType = data.reportType;
    this.records.content[index].catalog = data.catalog;
    this.records.content[index].codeGroup = data.codeGroup;
    this.records.content[index].defectType = data.defectType;
    this.records.content[index].inspector = data.inspector;
    this.records.content[index].shortText = data.shortText;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.defectRecordingId != id
    );
    return of(this.records);
  }

  save(item) {
    item.defectRecordingId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(item);
  }
}
 