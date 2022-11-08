import {Injectable} from '@angular/core';
import {BasePageService} from 'app/services/base/base-page.service';
import { HttpControllerService } from '../../core/http-controller.service';
import { OptionService } from '../../base/option-service';
import { Subject } from 'rxjs';

@Injectable()
export class CompanyService extends BasePageService {
    saveAction$ = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }
  save(data) {
    return this._httpSvc.post('company/save', data, this._opt.getHeader());
  }
  getAllCompanies() { return this._httpSvc.get('company/all', this._opt.getHeader()); }
  getAllCompaniesObservable() { return this._httpSvc.getObservable('company/all', this._opt.getHeader()); }

  delete(id: string) { return this._httpSvc.delete('company/delete/' + id, this._opt.getHeader()); }
}
