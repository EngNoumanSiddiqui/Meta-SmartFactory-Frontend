import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class InspectionService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterInspCharacteristic(data) { 
    return this._httpSvc.post('quality/inspectionCharacteristic/filter', data, this._opt.getHeader()); 
  }

  detailInspCharacteristic(id: string) {
     return this._httpSvc.get('quality/inspectionCharacteristic/detail/' + id, this._opt.getHeader()); 
  }

  saveInspCharacteristic(data) {
    return this._httpSvc.post('quality/inspectionCharacteristic/save', data, this._opt.getHeader());
  }

  updateInspCharacteristic(data) {
    return this._httpSvc.post('quality/inspectionCharacteristic/save', data, this._opt.getHeader());
  }

  deleteInspCharacteristic(id) {
    return this._httpSvc.delete('/quality/inspectionCharacteristic/delete/' + id, this._opt.getHeader());
  }
  
  // Insp. Char. new Model
  // ResponseQualityInspectionCharacteristicDto{
  //   createDate	string($date-time)
  //   inspectionCharacteristicCode	string
  //   inspectionCharacteristicId	integer($int32)
  //   inspectionCharacteristicName	string
  //   inspectionCharacteristicShortText	string
  //   inspectionCharacteristicStatus	string
  //   plant	PlantDto{...}
  //   qualityCatalogGroupList	[...]
  //   qualityCharacteristicControlIndicatorList	[...]
  //   qualityCharacteristicOperationList	[...]
  //   qualityDefectRecordingList	[...]
  //   qualityIndicatorCharacteristicSampleList	[...]
  //   qualityInspectionCharacteristicMethodList	[...]
  //   qualityInspectionCharacteristicOperationList	[...]
  //   qualityInspectionCharacteristicType	QualityInspectionCharacteristicTypeDto{...}
  //   qualityInspectionLotResultRecordingList	[...]
  //   updateDate	string($date-time)
  // }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        inspCharId: '1',
        inspCharCode: '0011',
        inspCharName: 'Insp Char 1',
        versionNo: '1.0',
        plant: null,
        inspCharType: 'Qualitative',
        validFrom: new Date(),
        shortText: 'short text',
        status: 'Ready'
      },
      {
        inspCharId: '2',
        inspCharCode: '0022',
        inspCharName: 'Insp Char 2',
        versionNo: '1.2',
        plant: null,
        inspCharType: 'Qualitative',
        validFrom: new Date(),
        shortText: 'short text',
        status: 'Ready'
      },
      {
        inspCharId: '3',
        inspCharCode: '0033',
        inspCharName: 'Insp Char 3',
        versionNo: '1.3',
        plant: null,
        inspCharType: 'Qualitative',
        validFrom: new Date(),
        shortText: 'short text',
        status: 'Ready'
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.inspCharId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.inspCharId === id);
    this.records.content[index].inspCharCode = data.inspCharCode;
    this.records.content[index].inspCharName = data.inspCharName;
    this.records.content[index].versionNo = data.versionNo;
    this.records.content[index].plant = data.plant;
    this.records.content[index].inspCharType = data.inspCharType;
    this.records.content[index].validFrom = data.validFrom;
    this.records.content[index].shortText = data.shortText;
    this.records.content[index].status = data.status;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.inspCharId != id
    );
    return of(this.records);
  }

  save(item) {
    item.inspCharId = Math.floor(Math.random() * 1000);
    this.records.content.push(item);
    return of(this.records);
  }
}
