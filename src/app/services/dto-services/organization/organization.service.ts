import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class OrganizationService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getByPlant(plantId) { return this._httpSvc.get('organization/all/'+ plantId , this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('organization/save', data, this._opt.getHeader()); }
  delete(id) { return this._httpSvc.delete('organization/delete/' + id, this._opt.getHeader()); }
}
