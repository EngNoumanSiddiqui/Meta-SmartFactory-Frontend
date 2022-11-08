/**
 * Created by reis on 1.11.2018.
 */
import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class AlertService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  getAlertMessageSubjectList() { return this._httpSvc.get('alertSubject/alertMessageSubjectList', this._opt.getHeader()); }

  updateAlertMessageSubject(data) {return this._httpSvc.post('alertSubject/updateAlertSubject', data, this._opt.getHeader()); }

  getAlertEmailList(id: string) { return this._httpSvc.get('alertEmployee/detail/' + id, this._opt.getHeader()); }
  saveAlertSettings(data) { return this._httpSvc.post('alertEmployee/save', data, this._opt.getHeader()); }
}

