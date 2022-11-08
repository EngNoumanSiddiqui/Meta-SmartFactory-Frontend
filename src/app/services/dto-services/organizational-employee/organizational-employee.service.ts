import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from '../../base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class OrganizationalEmployeeService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  filterEmployeeOrganizationChart(data) { 
    return this._httpSvc.post('employee/filterEmployeeOrganizationChart', data, this._opt.getHeader()); 
  }
}


