import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class InspectionPlanService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterInspectionPlan(data) { 
    return this._httpSvc.post('quality/inspectionPlan/filter', data, this._opt.getHeader()); 
  }
  filterInspectionPlanObservable(data) { 
    return this._httpSvc.postObservable('quality/inspectionPlan/filter', data, this._opt.getHeader()); 
  }

  detailInspectionPlan(id: string) {
     return this._httpSvc.get('quality/inspectionPlan/detail/' + id, this._opt.getHeader()); 
  }

  saveInspectionPlan(data) {
    return this._httpSvc.post('quality/inspectionPlan/save', data, this._opt.getHeader());
  }

  updateInspectionPlan(data) {
    return this._httpSvc.post('quality/inspectionPlan/save', data, this._opt.getHeader());
  }

  deleteInspectionPlan(id) {
    return this._httpSvc.delete('/quality/inspectionPlan/delete/' + id, this._opt.getHeader());
  }

  // New Model
  // ResponseQualityInspectionPlanDto{
  //   createDate	string($date-time)
  //   fromLotSize	integer($int32)
  //   groupNumberId	integer($int32)
  //   inspectionPlanCode	string
  //   inspectionPlanId	integer($int32)
  //   inspectionPlanStatus	string
  //   keyDate	string($date-time)
  //   planningWorkcenterId	integer($int32)
  //   plant	PlantDto{...}
  //   qualityUsage	QualityUsageDto{...}
  //   stock	ResponseStockDetailDto{...}
  //   toLotSize	integer($int32)
  //   updateDate	string($date-time)
  // }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        inspectionPlanId: '1',
        inspectionPlanCode: '0011',
        material: null,
        plant: null,
        usage: null,
        plannerGroup: null,
        planningWorkCenter: null,
        fromLotSize: null,
        toLotSize: null,
        keyDate: new Date(),
        status: null,
        group: 1,
        groupCounter: 6,
        createdDate: new Date('2013,10,30')
      },
      {
        inspectionPlanId: '2',
        inspectionPlanCode: '0022',
        material: null,
        plant: null,
        usage: null,
        plannerGroup: null,
        planningWorkCenter: null,
        fromLotSize: null,
        toLotSize: null,
        keyDate: new Date(),
        status: null,
        group: 1,
        groupCounter: 3,
        createdDate: new Date('2011,10,30')
      },
      {
        inspectionPlanId: '3',
        inspectionPlanCode: '0033',
        material: null,
        plant: null,
        usage: null,
        plannerGroup: null,
        planningWorkCenter: null,
        fromLotSize: null,
        toLotSize: null,
        keyDate: new Date(),
        status: null,
        group: 1,
        groupCounter: 7,
        createdDate: new Date('2012,10,30')
      }
    ]
  };

  getAll() {
    this.records.content.sort((a, b) => (a.createdDate < b.createdDate) ? 1 : -1);
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.inspectionPlanId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.inspectionPlanId === id);
    this.records.content[index].inspectionPlanCode = data.inspectionPlanCode;
    this.records.content[index].material = data.material;
    this.records.content[index].plant = data.plant;
    this.records.content[index].usage = data.usage;
    this.records.content[index].plannerGroup = data.plannerGroup;
    this.records.content[index].planningWorkCenter = data.planningWorkCenter;
    this.records.content[index].fromLotSize = data.fromLotSize;
    this.records.content[index].toLotSize = data.toLotSize;
    this.records.content[index].keyDate = data.keyDate;
    this.records.content[index].status = data.status;
    this.records.content[index].createdDate = data.createdDate;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.inspectionPlanId != id
    );
    return of(this.records);
  }

  save(item) {
    item.inspectionPlanId = Math.floor(Math.random() * 1000);
    item.createdDate = new Date();
    item.status = 'ready';
    this.records.content.unshift(item);
    return of(this.records);
  }
}
