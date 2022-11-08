import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { WorkstationCapacityDto } from "app/dto/workstation/workstation.model";
import { ShiftSettingsService } from "app/services/dto-services/shift-setting/shift-setting.service";
import { WorkcenterService } from "app/services/dto-services/workcenter/workcenter.service";
import { WorkstationErpService } from "app/services/dto-services/workstation/workstation-erp.service";
import { WorkstationService } from "app/services/dto-services/workstation/workstation.service";
import { LoaderService } from "app/services/shared/loader.service";
import { UtilitiesService } from "app/services/utilities.service";
import { SimulationEntity } from "../models/similation-entity.model";
import { environment } from 'environments/environment';
import * as moment from "moment";

@Component({
  selector: "app-simulation-add-capacity",
  templateUrl: "./simulation-add-capacity.component.html",
  styleUrls: ["./simulation-add-capacity.component.scss"],
})
export class SimulationAddCapacityComponent implements OnInit {
  editMode: boolean;
  id(id: any) {
    throw new Error("Method not implemented.");
  }
  initializeList(id: any) {
    throw new Error("Method not implemented.");
  }
  @Output() callBack = new EventEmitter<any>();
  @Output() simulationEmit = new EventEmitter<any>();
  @Output() saveAction = new EventEmitter<any>();
  @Input() simulation: SimulationEntity;
  @Input() plant: any;
  workstationUnitList;
  unitList;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      // this.editMode = true;
      this.initializeList(this.id);
    }
  };

  capacity = new WorkstationCapacityDto();
  workStationCapacityCategoryList;
  factoryCalendarRequestDto = {
    pageNumber: 1,
    pageSize: 20,
    plantId: null
  };
  workstationFactoryCalendarList;
  capacityUtilization;
  startTime;
  finishTime;
  @Input() dataFromSimulationCapacity: any;
  constructor(
    private utilities: UtilitiesService,
    private loadingService: LoaderService,
    private shiftService: ShiftSettingsService,
    private _workstationSvc: WorkstationService,
    private _workCentreSvc: WorkcenterService,
    private loaderService: LoaderService,
    private workstationErpService: WorkstationErpService,
  ) {
  }

  ngOnInit(): void {
    if (this.dataFromSimulationCapacity && this.dataFromSimulationCapacity.wsCapacityId) {
      this.capacity = Object.assign({}, this.dataFromSimulationCapacity);
      if(this.capacity.capacityUnitId){
        this.capacity = Object.assign({}, this.capacity);
        this.capacity.start = new Date(this.capacity.start);
        this.capacity.finish = new Date(this.capacity.finish);
        this.capacity.lenghtOfBreaks = moment().startOf('day').add(this.capacity.lenghtOfBreaks, 'second').toDate();
      }
    }
    this._workCentreSvc.getWorkStationId().subscribe(workStationId => {
      if ((workStationId)) {
        this.capacity.workstationId = workStationId.text;
      }
    });
    this.initialize();
  }

  async saveShiftSetting() {
    // if (this.shiftRequestDto) {
    //   try {
    //     console.log(this.shiftRequestDto);
    // this.shiftRequestDto.scheduleSimulationId = this.simulation.scheduleSimulationId;
    //     this.shiftRequestDto.plantId = this.plant.plantId;
    //     this.loadingService.showLoader();
    //     await this.shiftService.saveShiftSettings(this.shiftRequestDto);
    //     this.utilities.showSuccessToast("Save Success");
    //     this.buttonClicked("saved");
    //     this.loadingService.hideLoader();
    //   } catch (e) {
    //     this.utilities.showErrorToast("Save not success!!");
    //     this.loadingService.hideLoader();
    //   }
    // }
  }

  startTimeChange(value) {
    value.setSeconds(0)
    value.setMilliseconds(0);
    this.startTime = value;
    this.calculateAutoFields();
  }

  buttonClicked(type) {
    this.callBack.emit(type);
  }

  initialize() {
    this._workstationSvc.getworkStationCapacityCategoryList().then(result => {
      // console.log('====>' , this.workStationCapacityCategoryList);
      this.workStationCapacityCategoryList = result;
    }).catch(error => console.log(error));
    this._workstationSvc.getWorkstationUnitList().then(result => {
      this.workstationUnitList = result;
      this.unitList = result;
    }).catch(error => console.log(error));
    this._workstationSvc.getFilterFactoryCalendarList(this.factoryCalendarRequestDto).then(result => this.workstationFactoryCalendarList = result['content']).catch(error => console.log(error));
    // this._workstationSvc.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));
  }
  convertTimeToDuration(value) {
    return value.getSeconds() + value.getMinutes() * 60 + value.getHours() * 3600; // convert to second.
  }
  reset() {
    this.capacity = {
      'baseUnitMeasurementId': null,
      'capacity': null,
      'capacityUnitId': null,
      'capacityUtilization': null,
      'factoryCalendarId': null,
      'finish': null,
      'lenghtOfBreaks': null,
      'numberOfIndividualCapacity': null,
      'operationTime': null,
      'start': null,
      'workstationId': this.capacity.workstationId,
      'wsCapacityId': null,
      'scheduleSimulationId': null,
      'workCenterId': null
    };

    this.editMode = false;
  }
  save() {
    this.loaderService.showLoader();
    this.capacity.scheduleSimulationId = this.simulation.scheduleSimulationId;
    const capacityRequest = Object.assign({}, this.capacity);
    capacityRequest.lenghtOfBreaks = this.convertTimeToDuration(capacityRequest.lenghtOfBreaks);
    if (capacityRequest.factoryCalendarId) {
      capacityRequest.factoryCalendarId = +capacityRequest.factoryCalendarId;
    }
    this.workstationErpService.saveCapacity(capacityRequest)
      .then(response => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Work Station Capacity saved successfully');
        this.buttonClicked("saved");
        this.loadingService.hideLoader();

      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  capacityUtilizations(value) {
    this.capacityUtilization = value;
    this.calculateAutoFields();
  }
  baseUnitChanged(event: any) {
    this.capacity.baseUnitMeasurementId = event; // includes only measurement Id.
  }

  private calculateCapacity(start: Date, finish: Date, lenghtOfBreaks: number, capacityUtilization: number, numberOfIndividualCapacity: number) {
    // Capacity =  ( Finish - Start - Length of breaks ) * Capacity utilization / 100 * Number of individual capacities * (hour and entered unit ratio)
    const diffInMs = finish.getTime() - start.getTime() - this.convertTimeToDuration(lenghtOfBreaks) * 1000;
    let diffInHours: number = diffInMs / 1000 / 60 / 60;
    if (diffInHours < 0 || diffInHours === 0) {
      diffInHours += 24;
    }
    Math.floor(diffInHours);
    const capacity = diffInHours * (capacityUtilization / 100) * numberOfIndividualCapacity;
    return Number.parseFloat(capacity.toFixed(2));
  }
  calculateAutoFields() {
    if ((this.capacity.start) && (this.capacity.finish) && (this.capacity.lenghtOfBreaks) && (this.capacity.capacityUtilization)) {
      this.capacity.operationTime = this.calculateOperatingTime(this.capacity.start, this.capacity.finish, this.capacity.lenghtOfBreaks, this.capacity.capacityUtilization);
    }
    if ((this.capacity.start) && (this.capacity.finish) && (this.capacity.lenghtOfBreaks) && (this.capacity.capacityUtilization) && (this.capacity.numberOfIndividualCapacity)) {
      this.capacity.capacity = this.calculateCapacity(this.capacity.start, this.capacity.finish, this.capacity.lenghtOfBreaks, this.capacity.capacityUtilization, this.capacity.numberOfIndividualCapacity);
    }
    console.log('this.capacity.operationTime', this.capacity.operationTime);
    console.log('this.capacity.capacity', this.capacity.capacity);
  }
  calculateOperatingTime(start: Date, finish: Date, lenghtOfBreaks: Date, capacityUtilization) {
    const diffInMs: number = finish.getTime() - start.getTime() - this.convertTimeToDuration(lenghtOfBreaks) * 1000;
    let diffInHours: number = diffInMs / 1000 / 60 / 60;
    if (diffInHours < 0 || diffInHours === 0) {
      diffInHours += 24;
    }
    console.log('diffInHours', diffInHours)
    Math.floor(diffInHours);
    console.log('diffInHours_rounded', diffInHours)
    return Number.parseFloat(((diffInHours) * (capacityUtilization / 100)).toFixed(2));
  }

  endTimeChange(value) {
    value.setSeconds(0)
    value.setMilliseconds(0);
    this.finishTime = value;
    this.calculateAutoFields();
  }

}
