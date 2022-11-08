import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class NotificationTypesService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: string) { return this._httpSvc.delete('maintenance/notificationtype/delete/' + id, this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('maintenance/notificationtype/detail/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('maintenance/notificationtype/save', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('maintenance/notificationtype/filter', data, this._opt.getHeader()); }

}
