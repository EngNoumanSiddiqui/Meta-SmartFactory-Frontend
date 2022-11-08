import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class EnumBloodGroupService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getEnumList() { return this._httpSvc.get('enumbloodgroup', this._opt.getHeader()); }
}