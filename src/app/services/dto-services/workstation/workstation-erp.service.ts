import {Injectable} from '@angular/core';
import {HttpControllerService} from '../../core/http-controller.service';
import {BasePageService} from 'app/services/base/base-page.service';
import {OptionService} from '../../base/option-service';

@Injectable()
export class WorkstationErpService extends BasePageService {
  constructor(private _httpSvc: HttpControllerService, private _opt: OptionService) {
    super();
  }

  saveWorkstationPrmtEffcnRates(data) {
    return this._httpSvc.post('workstation/saveWorkstationPrmtEffcnRatesList', data, this._opt.getHeader());
  }

  getWorkstationPrmtEffcnRates(id: string) {
    return this._httpSvc.get('workstation/getWorkstationPrmtEffcnRates/' + id, this._opt.getHeader());
  }

  saveCapacity(data) {
    return this._httpSvc.post('workstation/saveWorkStationCapacity', data, this._opt.getHeader());
  }
  getWorkStationsCapacityListByWsId(id) {
    return this._httpSvc.get(`workstation/getWorkStationCapacityList/${id}`, this._opt.getHeader());
  }
  removeWorkstationCapacity(wsCapacityId: any) {
    return this._httpSvc.delete(`workstation/deleteWorkStationCapacity/${wsCapacityId}`, this._opt.getHeader());
  }

  getFactoryCalendarList(id) {
    return this._httpSvc.get(`/workstation/getFactoryCalendarList`, this._opt.getHeader());
  }



//   delete(id: string) {
//     return this._httpSvc.delete('workstation/deleteWorkStation/' + id, this._opt.getHeader());
//   }
//
//   getDetail(id: string) {
//     return this._httpSvc.get('workstation/detail/' + id, this._opt.getHeader());
//   }
//   getWorkStationsForJobOrderPlanning(data) {
//     return this._httpSvc.post('workstation/WorkStationsForJobOrderPlanning', data, this._opt.getHeader());
//   }
//
//   getUpdateDetail(id: string) {
//     return this._httpSvc.get('workstation/detail/update/' + id, this._opt.getHeader());
//   }
//
//
//   saveCapacity(data) {
//     return this._httpSvc.post('workstation/saveWorkStationCapacity', data, this._opt.getHeader());
//   }
//
//   update(data) {
//     return this._httpSvc.post('workstation/update', data, this._opt.getHeader());
//   }
//   //not available in swagger
//   updateWorkStationCapacity(data) {
//     return this._httpSvc.post('workstation/update', data, this._opt.getHeader());
//   }
//   filter(data) {
//     return this._httpSvc.post('workstation/filterworkstation', data, this._opt.getHeader());
//   }
//
//   filterObservable(data) {
//     return this._httpSvc.postObservable('workstation/filterworkstation', data, this._opt.getHeader());
//   }
//
//   getWorkStationsScheduleForWorkCenter(id) {
//     return this._httpSvc.get(`workstation/schedule/${id}`, this._opt.getHeader());
//   }
//   getWorkStationsCapacityListByWsId(id) {
//     return this._httpSvc.get(`workstation/getWorkStationCapacityList/${id}`, this._opt.getHeader());
//   }
//
//   getMachineStatus(data) {
//     return this._httpSvc.post('statisticallyReport/getMachineStatusReport', data, this._opt.getHeader());
//   }
//
//   filterWorkstationReport(data) {
//
//     return this._httpSvc.post('workstation/workstationReport', data, this._opt.getHeader());
//   }
//
//   getWorkstationReportDetail(data) {
//
//     return this._httpSvc.post(`workstation/workstationReportDetail`, data, this._opt.getHeader())
//   }
//
//   getWorkstationReportAvg(data) {
//   return this._httpSvc.post(`workstation/workstationAvgReport`, data, this._opt.getHeader())
//   }
//
//   getWorkstationUnitList() { return this._httpSvc.get('workstation/getWorkstationUnitList', this._opt.getHeader()); }
//
//   saveWorkstarionUnit(data) {
//     return this._httpSvc.post('workstation/saveWorkstationUnits', data, this._opt.getHeader());
//   }
//
// getCategoryList() {
//   return this._httpSvc.get('workstation/categoryList', this._opt.getHeader());
//  }
// getStandardKeyList() {
//   return this._httpSvc.get('workstation/standartKeyList', this._opt.getHeader());
// }
// getStandardKeyParameterList() {
//   return this._httpSvc.get('workstation/standartKeyParameterList', this._opt.getHeader());
// }
//
// getworkStationCapacityCategoryList(){
//   return this._httpSvc.get('workstation/getworkStationCapacityCategoryList', this._opt.getHeader());
//  }
//  getFactoryCalenderList()
//  {
//   return this._httpSvc.get('workstation/getFactoryCalenderList', this._opt.getHeader());
//  }


}
