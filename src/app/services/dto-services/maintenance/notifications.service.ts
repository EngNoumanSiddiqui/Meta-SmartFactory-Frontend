import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService extends BasePageService {
  public eventHandler = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/notification/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/notification/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/notification/save', data, this._opt.getHeader()); }
  statusChange(data) { return this._httpSvc.post('maintenance/notification/statusChange', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/notification/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('maintenance/notification/filter', data, this._opt.getHeader()); }

}
