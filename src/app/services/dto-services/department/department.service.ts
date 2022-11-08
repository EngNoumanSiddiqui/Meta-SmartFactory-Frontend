import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class DepartmentService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getIdNameList( ) { return this._httpSvc.get('department/departments', this._opt.getHeader() ); }

  save(data) { return this._httpSvc.post('department/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('department/update', data, this._opt.getHeader()); }


}
