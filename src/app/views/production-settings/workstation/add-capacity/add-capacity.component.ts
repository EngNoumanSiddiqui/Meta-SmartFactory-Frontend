import {WorkcenterService} from 'app/services/dto-services/workcenter/workcenter.service';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {WorkstationService} from 'app/services/dto-services/workstation/workstation.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {environment} from 'environments/environment';
import * as moment from 'moment';
import {WorkstationErpService} from '../../../../services/dto-services/workstation/workstation-erp.service';
import {WorkstationCapacityDto} from '../../../../dto/workstation/workstation.model';
import {ConvertUtil} from '../../../../util/convert-util';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'app-add-capacity',
  templateUrl: './add-capacity.component.html',
  styleUrls: ['./add-capacity.component.scss']
})
export class AddCapacityComponent implements OnInit {
  startTime;
  finishTime;
  lengthOfBreak;
  capacityUtilization;
  @Output() saveAction = new EventEmitter<any>();
  workStationCapacityCategoryList;
  workstationUnitList;
  unitList;
  workstationFactoryCalendarList;
  editMode = false;
  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      // this.editMode = true;
      this.initializeList(this.id);
    }
  };

  capacity = new WorkstationCapacityDto();
  capacityList: WorkstationCapacityDto[] = [];
  lenghtOfBreaks: any;
  factoryCalendarRequestDto = {
    pageNumber : 1,
    pageSize : 20,
    plantId: null
  };
  params = {
    dialog: {title: '', inputValue: ''}
  };

  @Input() addCapacity: boolean = false;

  plantSubscription: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _workstationSvc: WorkstationService,
              private _workCentreSvc: WorkcenterService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService, 
              private workstationErpService: WorkstationErpService,
              private _appStateSvc: AppStateService) {
                this.plantSubscription = this._appStateSvc.plantAnnounced$.subscribe((res: any) => {
                  if ((res) && res.plantId) {
                    this.factoryCalendarRequestDto.plantId = res.plantId;
                  }else{
                    this.factoryCalendarRequestDto.plantId = null;
                  } 
                });
  }

  ngOnInit() {
    this._workCentreSvc.getWorkStationId().subscribe(workStationId => {
      if ((workStationId)) {
        this.capacity.workstationId = workStationId.text;
      }
    });
    this.initialize();
  }
  save() {
    this.loaderService.showLoader();
    const capacityRequest = Object.assign({}, this.capacity);
     capacityRequest.lenghtOfBreaks = this.convertTimeToDuration(capacityRequest.lenghtOfBreaks);
     if(capacityRequest.factoryCalendarId) {
      capacityRequest.factoryCalendarId = +capacityRequest.factoryCalendarId;
     }
    this.workstationErpService.saveCapacity(capacityRequest)
      .then(response => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Work Station Capacity saved successfully');
        this.initializeList(this.id);
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
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

  private initializeList(id) {
    this.capacity.workstationId = id;
    this.loaderService.showLoader();
    this.workstationErpService.getWorkStationsCapacityListByWsId(this.capacity.workstationId)
      .then(result => {
        console.log('@Initialize Capacity List=', result);
        this.capacityList = result as WorkstationCapacityDto[];
        this.loaderService.hideLoader();
        this.capacityList.forEach(item => {
        if ((item.lenghtOfBreaks)) {
         item.lenghtOfBreaks = moment().startOf('day').add(item.lenghtOfBreaks, 'second').toDate();
        }
        if ((item.start)) {
          item.start = new Date(item.start);
        }
        if ((item.finish)) {
          item.finish = new Date(item.finish);
        }
      });
      })
      .catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
  }

  startTimeChange(value) {
    value.setSeconds(0)
    value.setMilliseconds(0);
    this.startTime = value;
    this.calculateAutoFields();
  }

  endTimeChange(value) {
    value.setSeconds(0)
    value.setMilliseconds(0);
    this.finishTime = value;
    this.calculateAutoFields();
  }


  convertTimeToDuration(value) {
    return value.getSeconds() + value.getMinutes() * 60 + value.getHours() * 3600; // convert to second.
  }

  capacityUtilizations(value) {
    this.capacityUtilization = value;
    this.calculateAutoFields();
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
    const diffInMs: number = finish.getTime() - start.getTime() -  this.convertTimeToDuration(lenghtOfBreaks) * 1000;
    let diffInHours: number = diffInMs / 1000 / 60 / 60;
    if (diffInHours < 0 || diffInHours === 0) {
      diffInHours += 24;
    }
    console.log('diffInHours', diffInHours )
    Math.floor(diffInHours);
    console.log('diffInHours_rounded', diffInHours )
    return Number.parseFloat(((diffInHours) * (capacityUtilization / 100)).toFixed(2));
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

  baseUnitChanged(event: any) {
    this.capacity.baseUnitMeasurementId = event; // includes only measurement Id.
 }

  editCapacity(i: number) {
    this.capacity = Object.assign({}, this.capacityList[i]);
    if(this.capacity.factoryCalendarId) {
      const fcalendar = this.workstationFactoryCalendarList.find(fc => fc.code == this.capacity.factoryCalendarId);
      if(fcalendar) {
        this.capacity.factoryCalendarId = fcalendar.factoryCalendarId;
      }
    }
    // change old date values to today.
    //below codes written because when we change the hour part of old capacity definition calendar componennt changes the date to today.
    //so hour difference can be for days. for example if we change the start time of inserted one month ago
    //new start date become: 01.02.2019 13:00
    //but finish  date still old: 01.01.2019 23:00

    const start = new Date();
    start.setHours(this.capacity.start.getHours());
    start.setMinutes(this.capacity.start.getMinutes());
    start.setSeconds(this.capacity.start.getSeconds());

    this.capacity.start = start;

    const finish = new Date();
    finish.setHours(this.capacity.finish.getHours());
    finish.setMinutes(this.capacity.finish.getMinutes());
    finish.setSeconds(this.capacity.finish.getSeconds());
    this.capacity.finish = finish;

    this.editMode = true;
  }

  cloneCapacity(i: number) {
    this.capacity = Object.assign({}, this.capacityList[i]);
    if(this.capacity.factoryCalendarId) {
      const fcalendar = this.workstationFactoryCalendarList.find(fc => fc.code == this.capacity.factoryCalendarId);
      if(fcalendar) {
        this.capacity.factoryCalendarId = fcalendar.factoryCalendarId;
      }
    }
    
    this.capacity.wsCapacityId = null;
    // change old date values to today.
    //below codes written because when we change the hour part of old capacity definition calendar componennt changes the date to today.
    //so hour difference can be for days. for example if we change the start time of inserted one month ago
    //new start date become: 01.02.2019 13:00
    //but finish  date still old: 01.01.2019 23:00
    const start = new Date();
    start.setHours(this.capacity.start.getHours());
    start.setMinutes(this.capacity.start.getMinutes());
    start.setSeconds(this.capacity.start.getSeconds());
    this.capacity.start = start;
    const finish = new Date();
    finish.setHours(this.capacity.finish.getHours());
    finish.setMinutes(this.capacity.finish.getMinutes());
    finish.setSeconds(this.capacity.finish.getSeconds());
    this.capacity.finish = finish;
    this.editMode = false;
  }

  removeCapacity(i: number) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        const wc = this.capacityList[i];
        if (wc) {
          this.loaderService.showLoader();
          this.workstationErpService.removeWorkstationCapacity(wc.wsCapacityId)
            .then(result => {
                this.loaderService.hideLoader();
                this.utilities.showSuccessToast('Work Station Capacity deleted successfully');
                this.initializeList(this.id);
              }
            )
            .catch(error => {
                this.loaderService.hideLoader();
                console.log(error);
              }
            );
        }
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  convertBreakLengthToStr(lenghtOfBreaks: any) {
    return ConvertUtil.longDuration2DHHMMSSTime(lenghtOfBreaks * 1000);
  }

  getCapacityCategoryById(capacityUnitId: any) {
    if (this.workStationCapacityCategoryList) {
      const workstationCapasityItemFiterArr = this.workStationCapacityCategoryList.filter(item => item.wsCapacityCode === capacityUnitId);
      if (workstationCapasityItemFiterArr != null && workstationCapasityItemFiterArr.length > 0) {
        return workstationCapasityItemFiterArr[0].wsCapacityCategory;
      } else {
        return '';
      }
    }
  }

  ngOnDestroy(){
    this.plantSubscription.unsubscribe(); 
  }
}
