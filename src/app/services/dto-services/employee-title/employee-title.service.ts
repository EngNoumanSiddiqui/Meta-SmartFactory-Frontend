import { Injectable } from '@angular/core';
import { BasePageService} from '../../base/base-page.service';
import { HttpControllerService} from '../../core/http-controller.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class EmployeeTitleService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  getIdNameList( ) { return this._httpSvc.get('employeetitle/employeetitles', this._opt.getHeader() ); }
  getIdNameListByPlantId(plantId: number) { return this._httpSvc.get('employeetitle/employeetitles/'+ plantId, this._opt.getHeader() ); }
  filter( data ) { return this._httpSvc.post('employee/title/filter', data , this._opt.getHeader() ); }

  update(data) { return this._httpSvc.post('employeetitle/update', data, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('employeetitle/save', data, this._opt.getHeader()); }

  saveEmployeeTitle(data) { return this._httpSvc.post('employee/title/save', data, this._opt.getHeader()); }
  
  delete(id) { return this._httpSvc.delete('employee/title/delete/' + id, this._opt.getHeader()); }

  getEmployeeById(id) { return this._httpSvc.get('employee/title/detail/' + id, this._opt.getHeader()); }
  


}

