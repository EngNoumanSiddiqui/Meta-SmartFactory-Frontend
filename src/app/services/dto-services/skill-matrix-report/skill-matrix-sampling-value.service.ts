import { Injectable } from '@angular/core';
import { BasePageService } from 'app/services/base/base-page.service';
import { HttpControllerService } from 'app/services/core/http-controller.service';
import { OptionService } from 'app/services/base/option-service';


@Injectable()
export class SkillMatrixSamplingValueService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }
  save(data) { return this._httpSvc.post('skillmatrix/samplingValue/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('skillmatrix/samplingValue/filter', data, this._opt.getHeader()); }
  delete(id) { return this._httpSvc.delete('skillmatrix/samplingValue/delete/'+id, this._opt.getHeader()); }
  details(id){ return this._httpSvc.get('skillmatrix/samplingValue/detail/' + id,this._opt.getHeader());}

}
