import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()
export class LocationService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService, private _httpShared: ShareHttpCallsService ) {
    super();
  }

  detail(id) { return this._httpSvc.get('location/detail/'+ id, this._opt.getHeader())}
  update(data) { return this._httpSvc.post('location/update', data, this._opt.getHeader()); }

  delete(id) { return this._httpSvc.delete('location/delete/'+id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('location/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('location/filter', data, this._opt.getHeader()); }
  filterObs(data) { return this._httpSvc.postObservable('location/filter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpShared.post('location/filter', data, this._opt.getHeader()); }

}
