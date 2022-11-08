import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class ProjectService extends BasePageService {
  // public saveAction$: Subject<any> = new Subject();
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

  delete(id: any) { return this._httpSvc.delete('project/delete/' + id, this._opt.getHeader()); }
  getDetail(id: any) { return this._httpSvc.get('project/detail/' + id, this._opt.getHeader()); }
  
  save(data) { return this._httpSvc.post('project/save', data, this._opt.getHeader()); }
  filter(data) { return this._httpSvc.post('project/filter', data, this._opt.getHeader()); }


  getMilestoneDetail(id: any) { return this._httpSvc.get('milestone/detail/' + id, this._opt.getHeader()); }
  
  updateMilestoneStatus(data: any) { return this._httpSvc.post('milestone/updateStatus', data, this._opt.getHeader()); }
  updateMilestone(data: any) { return this._httpSvc.post('milestone/save', data, this._opt.getHeader()); }
  filterMilestone(data) { return this._httpSvc.post('milestone/filter', data, this._opt.getHeader()); }
  deleteMilestone(id: any) { return this._httpSvc.delete('milestone/delete/' + id, this._opt.getHeader()); }

  getProjectTaskDetail(id: any) { return this._httpSvc.get('project/task/detail/' + id, this._opt.getHeader()); }
}
