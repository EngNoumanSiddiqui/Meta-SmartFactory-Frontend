import { Injectable } from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualityNotificationService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterNotification(data) { 
    return this._httpSvc.post('quality/notification/filter', data, this._opt.getHeader()); 
  }
  filterNotificationObservable(data) { 
    return this._httpSvc.post('quality/notification/filter', data, this._opt.getHeader()); 
  }

  detailNotification(id: string) {
     return this._httpSvc.get('quality/notification/detail/' + id, this._opt.getHeader()); 
  }

  saveNotification(data) {
    return this._httpSvc.post('quality/notification/save', data, this._opt.getHeader());
  }

  updateNotification(data) {
    return this._httpSvc.post('quality/notification/save', data, this._opt.getHeader());
  }

  deleteNotification(id) {
    return this._httpSvc.delete('quality/notification/delete/' + id, this._opt.getHeader());
  }

  // new Model
  // RequestCreateQualityNotificationDto{
  //   createDate	string($date-time)
  //   plantId	integer($int32)
  //   qualityNotificationCode	string
  //   qualityNotificationId	integer($int32)
  //   stockId	integer($int32)
  //   updateDate	string($date-time)
  // }

  records = {
    currentPage: 1,
    totalElements: 3, 
    totalPages: 1,
    content: [
      {
        notificationId: '1',
        notificationCode: '0011',
        materialNo: null,
        materialName: null,
        notificationType: null,
        customer: null,
        vendor: null,
        requiredStart: new Date(),
        requiredEnd: new Date(),
        priority: null,
        quantityUnit:null,
        description: null, 
        status: null,
        processingId: null,
        itemId: null,
      },
      {
        notificationId: '2',
        notificationCode: '0011',
        materialNo: null,
        materialName: null,
        notificationType: null,
        customer: null,
        vendor: null,
        requiredStart: new Date(),
        requiredEnd: new Date(),
        priority: null,
        quantityUnit: null,
        description: null,
        status: null,
        processingId: null,
        itemId: null,
      },
      {
        notificationId: '3',
        notificationCode: '0011',
        materialNo: null,
        materialName: null,
        notificationType: null,
        customer: null,
        vendor: null,
        requiredStart: new Date(),
        requiredEnd: new Date(),
        priority: null,
        quantityUnit: null,
        description: null,
        status: null,
        processingId: null,
        itemId: null,
      }
    ]
  };

  getAll() {
    return of(this.records);
  }

  getUpdateDetail(id: string) {
    return of(this.records.content.find(x => x.notificationId === id))
  }

  update(id: string, data) {
    const index = this.records.content.findIndex(x => x.notificationId === id);
    this.records.content[index].notificationCode = data.notificationCode;
    this.records.content[index].materialNo = data.materialNo;
    this.records.content[index].materialName = data.materialName;
    this.records.content[index].notificationType = data.notificationType;
    this.records.content[index].customer = data.customer;
    this.records.content[index].vendor = data.vendor;
    this.records.content[index].requiredStart = data.requiredStart;
    this.records.content[index].requiredEnd = data.requiredEnd;
    this.records.content[index].priority = data.priority;
    this.records.content[index].quantityUnit = data.quantityUnit
    this.records.content[index].description = data.description
    this.records.content[index].status = data.status;
    ;
    return of(this.records);
  }

  delete(id: string) {
    this.records.content = this.records.content.filter(
      obj => obj.notificationId != id
    );
    return of(this.records);
  }

  save(item) {
    item.notificationId = Math.floor(Math.random() * 1000);
    // item.createDate = new Date();
    this.records.content.unshift(item);
    return of(item);
  }

  // ***************** PROCESSING ************ 

  processing = [];
  
  getProcessingData(id: string) {
    console.log('showID', id);
    
    return of(this.processing.find(x => x.processingId == id))
  }

  saveProcessingData(notificationId, item) {
    
    item.processingId = Math.floor(Math.random() * 1000);
    const processingIndex = this.records.content.findIndex(x => x.notificationId == notificationId);
    this.records.content[processingIndex].processingId = item.processingId;

    this.processing.push(item);
    return of(this.processing);
  }
}
