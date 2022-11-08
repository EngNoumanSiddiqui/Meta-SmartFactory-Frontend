import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'workcenter-calendar-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class WorkCenterCalendarEditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();


  
  
  @Input('id') set calenderId (id) {
    if (id) {
      this.workCenterCalendarId = id;
      this.initialize(id);
    }
  }
  @Input('data') set calenderdata (data) {
    if (data) {
      this.workCenterCalendarId = data.workCenterCalendarId;
      this.initializeData(data);
    }
  }

  workCenterCalendarId: any;
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
    noUpdate: 0
  };

  
  
  constructor(
    private workstationService: WorkstationService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _userSvc: UsersService,
    private loaderService: LoaderService,
  ) { 
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    // if (this.selectedPlant) {
    //   this.reqDto.plantId = this.selectedPlant.plantId;
    // }
  }

  ngOnInit() {
    this.dataModel.startTime = new Date(this.dataModel.startTime);
    this.dataModel.endTime = new Date(this.dataModel.endTime);
    
  }

  private initialize(id: string) {
    this.loaderService.showLoader();
    this.workstationService.detailWorkCenterCalendar(id).then((result:any) => {
      this.loaderService.hideLoader();
      this.dataModel = result;
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  private initializeData(data) {
    this.dataModel = JSON.parse(JSON.stringify(data));
  }

  reset() {
    this.dataModel = {
      calendarReferenceId: this.dataModel.calendarReferenceId,
      endTime: null,
      fromERP: null,
      plantId: this.dataModel.plantId,
      startTime: null,
      workCenterCalendarId: this.dataModel.workCenterCalendarId,
      workCenterId: null,
      workStationId: null,
      noUpdate: 0
    };
  }

  saveWorkCenterCalendar() {
    this.loaderService.showLoader();
    this.dataModel.plantId = this.selectedPlant?.plantId;
    this.workstationService.saveWorkCenterCalendar(this.dataModel).then(dt => {
      this.utilities.showSuccessToast('saved-success');
      this.loaderService.hideLoader();
      setTimeout(() => {
        this.saveAction.emit('close');
      }, environment.DELAY);
    }).catch(err => {
      this.utilities.showErrorToast(err);
      this.loaderService.hideLoader();
    })
  }
 

 
}
