import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable()
export class InspectionLotService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterInspectionLot(data) { 
    return this._httpSvc.post('quality/inspectionLot/filter', data, this._opt.getHeader()); 
  }
  filterInspectionLotObservable(data) { 
    return this._httpSvc.postObservable('quality/inspectionLot/filter', data, this._opt.getHeader()); 
  }

  detailInspectionLot(id: string) {
     return this._httpSvc.get('quality/inspectionLot/detail/' + id, this._opt.getHeader()); 
  }

  saveInspectionLot(data) {
    return this._httpSvc.post('quality/inspectionLot/save', data, this._opt.getHeader());
  }

  updateInspectionLot(data) {
    return this._httpSvc.post('quality/inspectionLot/save', data, this._opt.getHeader());
  }

  deleteInspectionLot(id) {
    return this._httpSvc.delete('quality/inspectionLot/delete/' + id, this._opt.getHeader());
  }
  
// new MOdel
  // RequestCreateQualityInspectionLotDto{
  //   batch	string
  //   createDate	string($date-time)
  //   inspectionLotCode	string
  //   inspectionLotId	integer($int32)
  //   inspectionLotStatus	string
  //   jobOrderId	integer($int32)
  //   lotCreatedOn	string($date-time)
  //   lotCreatedTo	string($date-time)
  //   orderId	integer($int32)
  //   plantId	integer($int32)
  //   prodOrderId	integer($int32)
  //   qualityInfoRecordId	integer($int32)
  //   qualityInspectionOperationId	integer($int32)
  //   qualityInspectionTypeId	integer($int32)
  //   stockId	integer($int32)
  //   updateDate	string($date-time)
  //   vendorId	integer($int32)
  // }

  records = {
    currentPage: 1,
    totalElements: 3,
    totalPages: 1,
    content: [
      {
        inspectionLotId: '1',
        inspectionLotCode: '0011',
        materialNo: '1111',
        materialName: 'Material 1',
        plant: "Schumber",
        operation: "Operation 1",
        inspectionType: null,
        lotQuantity: null,
        quantityUnit: 'QList 1',
        createDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        status: null,
        vendor: null,
        batchCode: null,
        productionOrder: null,
        inspSpecId: null
      },
      {
        inspectionLotId: '2',
        inspectionLotCode: '0022',
        materialNo: '2222',
        materialName: 'Material 2',
        plant: "Schumber",
        operation: "Operation 2",
        inspectionType: null,
        lotQuantity: null,
        quantityUnit: 'QList 2',
        createDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        status: null,
        vendor: null,
        batchCode: null,
        productionOrder: null,
        inspSpecId: null
      },
      {
        inspectionLotId: '3',
        inspectionLotCode: '0033',
        materialNo: '3333',
        materialName: 'Material 2',
        plant: "Schumber",
        operation: "Operation 3",
        inspectionType: null,
        lotQuantity: null,
        quantityUnit: 'QList 3',
        createDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        status: null,
        vendor: null,
        batchCode: null,
        productionOrder: null,
        inspSpecId: null
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.inspectionLotId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.inspectionLotId === id);
    this.records.content[index].inspectionLotCode = data.inspectionLotCode;
    this.records.content[index].materialNo = data.materialNo;
    this.records.content[index].materialName = data.materialName;
    this.records.content[index].plant = data.plant;
    this.records.content[index].operation = data.operation;
    this.records.content[index].inspectionType = data.inspectionType;
    this.records.content[index].lotQuantity = data.lotQuantity;
    this.records.content[index].quantityUnit = data.quantityUnit;
    this.records.content[index].createDate = data.createDate;
    this.records.content[index].startDate = data.startDate;
    this.records.content[index].endDate = data.endDate;
    this.records.content[index].status = data.status;
    this.records.content[index].vendor = data.vendor;
    this.records.content[index].batchCode = data.batchCode;
    this.records.content[index].productionOrder = data.productionOrder;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.inspectionLotId != id
    );
    return of(this.records);
  }

  save(item) {
    
    item.inspectionLotId = Math.floor(Math.random() * 1000);
    item.createDate = new Date();
    this.records.content.unshift(item);
    return of(item);
  }

  // inspection specification work
  inspSpecifications = [];
  
  getInspSpec(id: string) {
    return of(this.inspSpecifications.find(x => x.inspectionSpecificationId == id))
  }

  saveInspSpec(inspLotId, item) {
    item.inspectionSpecificationId = Math.floor(Math.random() * 1000);
    // save insp. spec. id to inspection lot
    const inspLotIndex = this.records.content.findIndex(x => x.inspectionLotId == inspLotId);
    this.records.content[inspLotIndex].inspSpecId = item.inspectionSpecificationId;

    // save item to insp. spec.
    this.inspSpecifications.push(item);
    return of(this.inspSpecifications);
  }

  updateInspSpec(id: string, data) {
    const index = this.inspSpecifications.findIndex(x => x.inspectionSpecificationId === id);
    this.inspSpecifications[index].inspectionPlan = data.inspectionPlan;
    this.inspSpecifications[index].group = data.group;
    this.inspSpecifications[index].groupCounter = data.groupCounter;
    this.inspSpecifications[index].usage = data.usage;
    this.inspSpecifications[index].sampleSize = data.sampleSize;
    this.inspSpecifications[index].keyDate = data.keyDate;
    return of(this.inspSpecifications);
  }
}
