import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class InspectionMethodService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterInspectionMethod(data) { 
    return this._httpSvc.post('quality/inspectionMethod/filter', data, this._opt.getHeader()); 
  }
  filterInspectionMethodObservable(data) { 
    return this._httpSvc.postObservable('quality/inspectionMethod/filter', data, this._opt.getHeader()); 
  }

  detailInspectionMethod(id: string) {
     return this._httpSvc.get('quality/inspectionMethod/detail/' + id, this._opt.getHeader()); 
  }

  saveInspectionMethod(data) {
    return this._httpSvc.post('quality/inspectionMethod/save', data, this._opt.getHeader());
  }

  updateInspectionMethod(data) {
    return this._httpSvc.post('quality/inspectionMethod/save', data, this._opt.getHeader());
  }

  deleteInspectionMethod(id) {
    return this._httpSvc.delete('/quality/inspectionMethod/delete/' + id, this._opt.getHeader());
  }

  // new model
  // RequestCreateQualityInspectionMethodDto{
  //   createDate	string($date-time)
  //   description	string
  //   inspectionMethodCode	string
  //   inspectionMethodId	integer($int32)
  //   inspectionMethodName	string
  //   inspectionMethodStatus	string
  //   plantId	integer($int32)
  //   qualityCharacteristicOperationList	[...]
  //   qualityInspectionCharacteristicMethodList	[...]
  //   qualityInspectionCharacteristicOperationList	[...]
  //   updateDate	string($date-time)
  //   validFrom	string($date-time)
  // }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        inspectionMethodId: '1',
        inspectionMethodCode: '0011',
        inspectionMethodName: null,
        plant: null,
        validFrom: new Date(),
        description: 'ddddddd',
        status: 'Ready',
      },
      {
        inspectionMethodId: '2',
        inspectionMethodCode: '0022',
        inspectionMethodName: null,
        plant: null,
        validFrom: new Date(),
        description: 'ddddddd',
        status: 'Ready',
      },
      {
        inspectionMethodId: '3',
        inspectionMethodCode: '0033',
        inspectionMethodName: null,
        plant: null,
        validFrom: new Date(),
        description: 'ddddddd',
        status: 'Ready',
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.inspectionMethodId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.inspectionMethodId === id);
    this.records.content[index].inspectionMethodCode = data.inspectionMethodCode;
    this.records.content[index].inspectionMethodName = data.inspectionMethodName;
    this.records.content[index].plant = data.plant;
    this.records.content[index].validFrom = data.validFrom;
    this.records.content[index].description = data.description;
    this.records.content[index].status = data.status;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.inspectionMethodId != id
    );
    return of(this.records);
  }

  save(item) {
    item.inspectionMethodId = Math.floor(Math.random() * 1000);
    item.status = 'Ready';
    this.records.content.push(item);
    return of(this.records);
  }
}
