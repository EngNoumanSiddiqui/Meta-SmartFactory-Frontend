import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class WorkcenterService extends BasePageService {

  private plantSubject = new Subject<any>();
  private workCentreSubject = new Subject<any>();

  private workCategorySubject = new Subject<any>();
  private workStationSubject = new Subject<any>();
  saveAction$ = new Subject<any>();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id) { return this._httpSvc.delete('workcenter/deleteworkcenter/' + id, this._opt.getHeader()); }

  getIdNameList() { return this._httpSvc.get('workcenter/workcenters/', this._opt.getHeader()); }

  getDetail(id: string) { return this._httpSvc.get('workcenter/detail/' + id, this._opt.getHeader()); }

  getUpdateDetail(id: string) { return this._httpSvc.get('workcenter/detail/update/' + id, this._opt.getHeader()); }

  save(data) { return this._httpSvc.post('workcenter/save', data, this._opt.getHeader()); }

  update(data) { return this._httpSvc.post('workcenter/update', data, this._opt.getHeader()); }

  filter(data) { return this._httpSvc.post('workcenter/filterworkcenter', data, this._opt.getHeader()); }
  filterObservable(data) { return this._httpSvc.postObservable('workcenter/filterworkcenter', data, this._opt.getHeader()); }
  sendPlantID(message: any) {
    this.plantSubject.next({ text: message});
  }
  getPlantID(): Observable<any> {
    return this.plantSubject.asObservable();
  }
  sendWorkCentreID(message: any) {
    this.workCentreSubject.next({ text: message});
  }

  getWorkStationId(): Observable<any> {
    return this.workStationSubject.asObservable();
  }
  sendWorkStationId(message: any) {
    this.workStationSubject.next({text: message});
  }
  getWorkCentreID(): Observable<any> {
    return this.workCentreSubject.asObservable();
  }
  sendWorkCategoryID(message: any) {
    this.workCategorySubject.next({ text: message});
  }
  getWorkCategoryID(): Observable<any> {
    return this.workCategorySubject.asObservable();
  }

}
