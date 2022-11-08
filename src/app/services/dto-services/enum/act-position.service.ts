/**
 * Created by reis on 20.11.2018.
 */
import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';

@Injectable()
export class EnumActPositionService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getEnumActPOsitionList() { return this._httpSvc.get('AccountPositionEnum', this._opt.getHeader()); }
}

