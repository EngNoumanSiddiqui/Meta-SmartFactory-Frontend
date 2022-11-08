import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SimulationService } from "app/services/dto-services/simulation/simulation.service";
import { LoaderService } from "app/services/shared/loader.service";
import { UtilitiesService } from "app/services/utilities.service";
import { SimulationEntity } from "../models/similation-entity.model";
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConfirmationService } from "primeng";
import { TranslateService } from "@ngx-translate/core";
import { WorkstationService } from "app/services/dto-services/workstation/workstation.service";
import { WorkstationErpService } from "app/services/dto-services/workstation/workstation-erp.service";
import { ShiftSettingsService } from "app/services/dto-services/shift-setting/shift-setting.service";
import { ConvertUtil } from "app/util/convert-util";

@Component({
  selector: "app-add-simulation",
  templateUrl: "./add-simulation.component.html",
  styleUrls: ["./add-simulation.component.scss"],
})
export class AddSimulationComponent implements OnInit {
  @Output() callBack = new EventEmitter<any>();
  @Output() callSimulationBack = new EventEmitter<any>();
  @Output() callEditShiftEvent = new EventEmitter<any>();
  @Output() callEditCalenderEvent = new EventEmitter<any>();
  @Output() callEditCapacityEvent = new EventEmitter<any>();
  @Input() simulation: SimulationEntity = {};
  @Input() plant: any;

  baseSimulation: string;
  EmployeeGroupeList = [];

  shifts: any;
  shiftCol = [
    { field: "shiftNo", header: "shift-no" },
    { field: "shiftName", header: "shift-name" },
    { field: "shiftOrderNo", header: "shift-order-no" },
    { field: "startTime", header: "start-time" },
    { field: "endTime", header: "finish-time" },
    { field: "description", header: "description" },
    { field: "maxChangeOverCount", header: "schedule-max-change-over-count" },
  ];

  calendars: any;
  calendarCol = [
    { field: "workCenterCalendarId", header: "workcenter-calendar-id" },
    { field: "calendarReferenceId", header: "reference-id" },
    { field: "workCenterId", header: "workcenter" },
    { field: "workStationId", header: "workstation" },
    { field: "startTime", header: "start-time" },
    { field: "endTime", header: "end-time" },
  ];

  capacities: any;
  capacityCol = [
    { field: "factoryCalendarId", header: "capacity-category" },
    { field: "workstationName", header: "Workstation" },
    { field: "factoryCalendarName", header: "factory-calendar" },
    { field: "baseUnitMeasurementId", header: "base-unit-measure" },
    { field: "start", header: "start" },
    { field: "finish", header: "finish" },
    { field: "lenghtOfBreaks", header: "length-break" },
    { field: "operationTime", header: "operating-time" },
    { field: "numberOfIndividualCapacity", header: "number-of-individual-capacity" },
    { field: "capacity", header: "capacity" },
  ];

  constructor(
    private simulationService: SimulationService,
    private utilities: UtilitiesService,
    private loadingService: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _shiftservice: ShiftSettingsService,
    private _loaderSvc: LoaderService,
    private _workStationSvc: WorkstationService,
    private _workStationErpSvc: WorkstationErpService,
    private workstationService: WorkstationService
  ) {
  }

  ngOnInit(): void {

    if (this.simulation?.scheduleSimulationId) {
      this.baseSimulation = JSON.stringify(this.simulation);
      this.records();
    }
  }

  async records() {
    try {
      this.shifts = await this.simulationService.getshiftList(
        this.plant.plantId,
        this.simulation.scheduleSimulationId
      );

      this.shifts.forEach(item => {
        item.startTime = ConvertUtil.UTCTime2LocalTime(item.startTime);
        item.endTime = ConvertUtil.UTCTime2LocalTime(item.endTime);
      });
      
      this.capacities = await this.simulationService.getWorkStationCapacityList(
        this.simulation.scheduleSimulationId
      );
      // this.capacities.forEach(item => {
      //   item.start = ConvertUtil.UTCTime2LocalTime(item.start);
      //   item.finish = ConvertUtil.UTCTime2LocalTime(item.finish);
      //   // item.lenghtOfBreaks = ConvertUtil.UTCTime2LocalTime(item.lenghtOfBreaks);
      // });
      
      let res: any = await this.simulationService.getfactoryCalendarFilter(this.plant.plandId,
        this.simulation.scheduleSimulationId
      );
      this.calendars = res.content;
      // this.calendars.forEach(item => {
      //   item.startTime = ConvertUtil.UTCTime2LocalTime(item.startTime);
      //   item.endTime = ConvertUtil.UTCTime2LocalTime(item.endTime);
      // });

    } catch (error) {
      console.log("error: ", error);
    }
  }

  deleteCapacity(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant("do-you-want-to-delete"),
      header: this._translateSvc.instant("delete-confirmation"),
      icon: "fa fa-trash",
      accept: async () => {
        await this._workStationErpSvc.removeWorkstationCapacity(id);
        this.utilities.showSuccessToast("Save Deleted");
        this.records();
        this._loaderSvc.hideLoader();
      },
      reject: () => {
        this.utilities.showInfoToast("cancelled-operation");
      },
    });
  }

  deleteCalendar(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant("do-you-want-to-delete"),
      header: this._translateSvc.instant("delete-confirmation"),
      icon: "fa fa-trash",
      accept: async () => {
        await this._workStationSvc.deleteWorkCenterCalendar(id);
        this.utilities.showSuccessToast("Save Deleted");
        this.records();
        this._loaderSvc.hideLoader();
      },
      reject: () => {
        this.utilities.showInfoToast("cancelled-operation");
      },
    });
  }

  deleteShift(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant("do-you-want-to-delete"),
      header: this._translateSvc.instant("delete-confirmation"),
      icon: "fa fa-trash",
      accept: async () => {
        await this._shiftservice.delete(id);
        this.utilities.showSuccessToast("Save Deleted");
        this.records();
        this._loaderSvc.hideLoader();
      },
      reject: () => {
        this.utilities.showInfoToast("cancelled-operation");
      },
    });
  }

  closeButtonClicked(type) {
    this.callSimulationBack.emit(type);
  }

  buttonClicked(type) {
    this.callBack.emit(type);
  }

  async save() {
    try {
      this.loadingService.showLoader();
      if (!this.simulation.scheduleSimulationId) {
        this.simulation.plantId = this.plant.plantId;
      }
      // this.simulation.createDate = JSON.stringify(new Date());
      // this.simulation.employeeId = null;

      let res = await this.simulationService.save(this.simulation);
      this.simulation.scheduleSimulationId = res['scheduleSimulationId'];
      this.utilities.showSuccessToast("Save Success");
      // this.buttonClicked("saved");
      this.loadingService.hideLoader();
    } catch (error) {
      console.log("error: ", error);
      this.utilities.showErrorToast("Something went wromg");
      this.loadingService.hideLoader();
    }
  }

 
  reset() {
    this.simulation = JSON.parse(this.baseSimulation);
  }

  modalShowShift(data) {
    if (data) {
      this.callEditShiftEvent.emit(data);
    }
  }

  modalShowCalender(data) {
    if (data) {
      this.callEditCalenderEvent.emit(data);
    }
  }

  modalShowCapacity(data) {
    if (data) {
      this.callEditCapacityEvent.emit(data);
    }
  }

}
