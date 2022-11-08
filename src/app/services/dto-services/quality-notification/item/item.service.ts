import { Injectable } from '@angular/core';
import { BasePageService } from '../../../base/base-page.service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';

@Injectable()
export class ItemService extends BasePageService { 
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService) {
      super();
  }

  filterNotificationItem(data) { 
  return this._httpSvc.post('quality/notificationItem/filter', data, this._opt.getHeader()); 
  }
  filterNotificationItemObservable(data) { 
  return this._httpSvc.post('quality/notificationItem/filter', data, this._opt.getHeader()); 
  }

  detailNotificationItem(id: string) {
    return this._httpSvc.get('quality/notificationItem/detail/' + id, this._opt.getHeader()); 
  }

  saveNotificationItem(data) {
  return this._httpSvc.post('quality/notificationItem/save', data, this._opt.getHeader());
  }

  updateNotificationItem(data) {
  return this._httpSvc.post('quality/notificationItem/save', data, this._opt.getHeader());
  }

  deleteNotificationItem(id) {
  return this._httpSvc.delete('quality/notificationItem/delete/' + id, this._opt.getHeader());
  }
}
