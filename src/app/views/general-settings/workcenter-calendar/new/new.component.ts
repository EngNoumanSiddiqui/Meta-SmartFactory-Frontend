import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { SimulationEntity } from 'app/views/manufacturing-planning-system/advance-manufacturing/models/similation-entity.model';
import * as moment from 'moment';

@Component({
  selector: 'workcenter-calendar-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class WorkCenterCalendarNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  @Output() callBack = new EventEmitter<any>();
  @Input() simulation: SimulationEntity;
  @Input() plant: any;
  @Input() dataFromSimulation: any;



  selectedPlant: any;
  dataModel = {
    calendarReferenceId: null,
    endTime: null,
    fromERP: null,
    plantId: null,
    startTime: null,
    workCenterCalendarId: null,
    workCenterId: null,
    workStationId: null,
    scheduleSimulationId: null,
    noUpdate: false

  };

  constructor(private workstationService: WorkstationService,
    private utilities: UtilitiesService,
    private _userSvc: UsersService,
    private loaderService: LoaderService,
  ) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    this.dataModel.plantId = this.selectedPlant?.plantId;
  }
  ngOnInit() {
    if (this.dataFromSimulation && this.dataFromSimulation.workCenterCalendarId) {
      this.dataModel = Object.assign({}, this.dataFromSimulation);
      this.dataModel.startTime = new Date(this.dataModel.startTime);
      this.dataModel.endTime = new Date(this.dataModel.endTime);
    }
  }

  reset() {
    this.dataModel = {
      calendarReferenceId: null,
      endTime: null,
      fromERP: null,
      plantId: this.dataModel.plantId,
      startTime: null,
      workCenterCalendarId: null,
      workCenterId: null,
      workStationId: null,
      scheduleSimulationId: null,
      noUpdate: false
    };
  }

   saveWorkcenterCalendar() {
    if (this.dataModel) {
      try {
        // console.log(this.dataModel);
        if(this.simulation) {
          this.dataModel.scheduleSimulationId = this.simulation.scheduleSimulationId;
        }
        
        this.dataModel.plantId = this.selectedPlant?.plantId;

        this.loaderService.showLoader();
        this.workstationService.saveWorkCenterCalendar(this.dataModel);
        this.utilities.showSuccessToast("Save Success");
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
        this.loaderService.hideLoader();
      } catch (e) {
        this.utilities.showErrorToast("Save not success!!");
        this.loaderService.hideLoader();
      }
    }
  }

  buttonClicked(type) {
    this.callBack.emit(type);
  }
  // saveWorkCenterCalendar() {
  //   this.loaderService.showLoader();
  //   this.workstationService.saveWorkCenterCalendar(this.dataModel).then(dt => {
  //     this.utilities.showSuccessToast('saved-success');
  //     this.loaderService.hideLoader();
  //     setTimeout(() => {
  //       this.saveAction.emit('close');
  //     }, environment.DELAY);
  //     this.saveSimulationCalendar();
  //   }).catch(err => {
  //     this.utilities.showErrorToast(err);
  //     this.loaderService.hideLoader();
  //   })
  // }



}
