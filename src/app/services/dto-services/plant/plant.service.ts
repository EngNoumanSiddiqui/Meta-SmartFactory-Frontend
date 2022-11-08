import { Injectable } from '@angular/core';
import { HttpControllerService } from '../../core/http-controller.service';
import { BasePageService } from 'app/services/base/base-page.service';
import { OptionService} from '../../base/option-service';

@Injectable()
export class PlantService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService ) {
    super();
  }

getAllPlants() { return this._httpSvc.get('plant/all', this._opt.getHeader()); }

save(data) { return this._httpSvc.post('plant/save', data, this._opt.getHeader()); }
deleteplant(id) { return this._httpSvc.delete('plant/delete/' + id, this._opt.getHeader()); }

// put into industry service & stopcause
getDetail(id: number) {return this._httpSvc.get('plant/detail/' + id, this._opt.getHeader());}
getAllIndustry() { return this._httpSvc.get('industry/list', this._opt.getHeader()); }
getAllMaterialGroup() { return this._httpSvc.get('materialgroup/list', this._opt.getHeader()); }
getSelectedPlantMaterialGroup(plantId: any) { return this._httpSvc.get('materialgroup/list/' + plantId, this._opt.getHeader()); }
// getMaterialGroupDetails(id: any) { return this._httpSvc.get('materialgroup/detail/' + plantId, this._opt.getHeader()); }
saveMaterialGroup(data) { return this._httpSvc.post('materialgroup/save', data, this._opt.getHeader()); }
saveIndustry(data) { return this._httpSvc.post('industry/save', data, this._opt.getHeader()); }

delete(id: string) { return this._httpSvc.delete('industry/delete/' + id, this._opt.getHeader()); }
deleteMaterial(id: string) { return this._httpSvc.delete('materialgroup/delete/' + id, this._opt.getHeader()); }


getAllStopCauseTypes(plantId) { return this._httpSvc.get('stopcausetype/stopcausetypes/' + plantId, this._opt.getHeader()); }
saveStopCause(data) { return this._httpSvc.post('stopcausetype/save', data, this._opt.getHeader()); }
deleteStopCause(id: string) { return this._httpSvc.delete('stopcausetype/delete/' + id, this._opt.getHeader()); }



}
