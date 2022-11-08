import { Injectable } from '@angular/core';
import {BasePageService} from '../../base/base-page.service';
import {HttpControllerService} from '../../core/http-controller.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class EnumJobOrderStatusService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getJobOrderEnumList() { return this._httpSvc.get('JobOrderStatusEnum', this._opt.getHeader()); }
  getJobOrderPositionList() { return this._httpSvc.get('JobOrderPositionStatusEnum', this._opt.getHeader()); }z
}

