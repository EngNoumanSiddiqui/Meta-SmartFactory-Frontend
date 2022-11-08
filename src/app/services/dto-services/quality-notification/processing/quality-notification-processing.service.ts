import { Injectable } from '@angular/core';
import {BasePageService} from 'app/services/base/base-page.service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable()
export class QualityNotificationProcessingService extends BasePageService {
  constructor(
     private _httpSvc: HttpControllerService,
     private _opt: OptionService) {
        super();
  }

  filterNotificationProcessing(data) { 
    return this._httpSvc.post('quality/notificationProcessing/filter', data, this._opt.getHeader()); 
  }
  filterNotificationProcessingObservable(data) { 
    return this._httpSvc.post('quality/notificationProcessing/filter', data, this._opt.getHeader()); 
  }

  detailNotificationProcessing(id: string) {
     return this._httpSvc.get('quality/notificationProcessing/detail/' + id, this._opt.getHeader()); 
  }

  saveNotificationProcessing(data) {
    return this._httpSvc.post('quality/notificationProcessing/save', data, this._opt.getHeader());
  }

  updateNotificationProcessing(data) {
    return this._httpSvc.post('quality/notificationProcessing/save', data, this._opt.getHeader());
  }

  deleteNotificationProcessing(id) {
    return this._httpSvc.delete('quality/notificationProcessing/delete/' + id, this._opt.getHeader());
  }
}
