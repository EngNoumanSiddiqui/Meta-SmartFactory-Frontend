import { Injectable } from "@angular/core";
import { BasePageService } from "app/services/base/base-page.service";
import { HttpControllerService } from "app/services/core/http-controller.service";
import { OptionService } from "app/services/base/option-service";

@Injectable({
  providedIn: "root",
})
export class SimulationService extends BasePageService {
  constructor(
    private _httpSvc: HttpControllerService,
    private _opt: OptionService
  ) {
    super();
  }

  save(data) {
    return this._httpSvc.post(
      "scheduleSimulation/save",
      data,
      this._opt.getHeader()
    );
  }
  filter(data) {
    return this._httpSvc.post(
      "scheduleSimulation/filter",
      data,
      this._opt.getHeader()
    );
  }
  getSimulation(data) {
    return this._httpSvc.get(
      "scheduleSimulation/detail/145",
      this._opt.getHeader()
    );
  }
  delete(id) {
    return this._httpSvc.delete(
      "scheduleSimulation/delete/" + id,
      this._opt.getHeader()
    );
  }
  getUpdateDetail(id) {
    return this._httpSvc.get(
      "scheduleSimulation/detail/" + id,
      this._opt.getHeader()
    );
  }
  getWorkStationCapacityList(id) {
    return this._httpSvc.get(
      "workstation/getWorkStationCapacityListBySimulation/" + id,
      this._opt.getHeader()
    );
  }
  getfactoryCalendarFilter(plant, id) {
    let data = {
      orderByDirection: "scheduleSimulationId",
      orderByProperty: "desc",
      pageNumber: 1,
      pageSize: 500,
      plantId: plant,
      scheduleSimulationId: id,
    };
    return this._httpSvc.post(
      "workcenter/calendar/filter",
      data,
      this._opt.getHeader()
    );
  }
  getshiftList(plandId, simulationId) {
    return this._httpSvc.get(
      `shift/shiftListSimulation/${plandId}/${simulationId}`,
      this._opt.getHeader()
    );
  }
}
