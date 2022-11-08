import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from '../../base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class TeepService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }



  workstationTeeps(data) { return this._httpSvc.post('teep/workstation', data, this._opt.getHeader()); }


}
