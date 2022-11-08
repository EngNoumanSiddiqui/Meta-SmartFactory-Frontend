/**
 * Created by reis on 7.11.2018.
 */
import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from '../../base/base-page.service';
import { OptionService} from '../../base/option-service';
@Injectable()
export class PowerConsuptionSettingsService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  getDetail() { return this._httpSvc.get('tariff/getDetail', this._opt.getHeader()); }
  save(data) { return this._httpSvc.post('tariff/save', data, this._opt.getHeader()); }
  }
