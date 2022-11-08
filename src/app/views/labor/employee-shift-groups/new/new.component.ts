import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';

import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';
import { ShiftSettingsResponseDto } from 'app/dto/shift/shift.dto';
import { ConvertUtil } from 'app/util/convert-util';
 
import {Subscription} from "rxjs";
import {AppStateService} from '../../../../services/dto-services/app-state.service';

@Component({
  selector: 'emp-shift-group-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  /*******formModle*******/
  employeeShift = {
    active: true,
    employeeGenericGroupId: null,
    employeeGroupId: null,
    employeeIdList: null,
    startDate: null,
    startTime: null,
    finishDate: null,
    finishTime: null,
    groupCode: null,
    groupName: null,
    shiftId: null,
    plantId: null
  };

  empGenericGroupFilter = {
    pageNumber: 1,
    pageSize: 9999,
    employeeGroupId: null,
    groupCode: null,
    groupName: null,
    groupSubType: 'SHIFT_GROUP',
    groupType: 'HUMAN_RESOURCES',
    plantId: null,
    plantName: null,
    parentGroup: null,
    referenceItemId: null,
    orderByDirection: 'desc',
    orderByProperty: 'employeeGenericGroupId',
    query: null
  };

  selectedPlant: any;
  sub: Subscription;

  selectedEmployee: any;

  empGenericList = [];

  shiftList = [];

  members: any;

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _shiftService: ShiftSettingsService,
    private appStateService: AppStateService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _empGeneralSvc: EmployeeGenericGroupService) {

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res)) {
        this.selectedPlant = res;
        this.employeeShift.plantId = res.plantId;
        this.empGenericGroupFilter.plantId = res.plantId;
        this.empGenericGroupFilter.plantName= res.plantName;
      } else {
        this.selectedPlant = null;
        this.employeeShift.plantId = null;
        this.empGenericGroupFilter.plantId = null;
        this.empGenericGroupFilter.plantName = null;
      }
      this.filter(this.empGenericGroupFilter);
      this.getShiftList();
    });
  }

  ngOnInit() {
    this.filter(this.empGenericGroupFilter);
    this.getShiftList();
  }

  filter(data) {
    this._empGeneralSvc.filter(data)
      .then(result => {
        this.empGenericList = result['content'];
      }).catch(error => {
      this.utilities.showErrorToast(error)
    });
  }

  getShiftList() {
    const plantId = this.empGenericGroupFilter.plantId;
    this._shiftService.getShiftSettingsListByPlantId(plantId).then((res: ShiftSettingsResponseDto[]) => {
      this.shiftList = res;
    });
  }

  onShiftGroupChange(event){
    const shift = this.empGenericList.find(item => item.employeeGenericGroupId == event);
    if(shift){
      // this.employeeShift.groupName = shift.groupName;
      // this.employeeShift.groupCode = shift.groupCode;
      this.employeeShift.employeeGenericGroupId = shift.employeeGenericGroupId;
      if(shift.members && shift.members.length > 0){
        this.employeeShift.employeeIdList = shift.members.map(item => item.employeeId);
      }
      this.members = shift.members;
    }else{
      this.employeeShift.groupName = null;
      this.employeeShift.groupCode = null;
      this.employeeShift.employeeGenericGroupId = null;
      this.employeeShift.employeeIdList = null;
      this.members = [];
    }

  }

  onShiftChange(event){
    const shift = this.shiftList.find(item => item.shiftId == event);
    if(shift){
      var date = new Date();
      if (shift.startTime) {
        const splitStartTime:any = ConvertUtil.UTCTime2LocalTime(shift.startTime).split(":", 2);
        let startTime = date.setHours(splitStartTime[0], splitStartTime[1]);
        this.employeeShift.startTime = new Date(startTime);
      }
      if (shift.endTime) {
        const splitEndTime:any = ConvertUtil.UTCTime2LocalTime(shift.endTime).split(":", 2);
        let endTime = date.setHours(splitEndTime[0], splitEndTime[1]);
        this.employeeShift.finishTime = new Date(endTime);
      }
      // if(shift.startTime){
      //   const splitStartTime = shift.startTime.split(":", 2);
      //   let startTime = date.setHours(splitStartTime[0], splitStartTime[1]);
      //   this.employeeShift.startTime = new Date(startTime);
      // }
      // if(shift.endTime){
      //   const splitEndTime = shift.endTime.split(":", 2);
      //   let endTime = date.setHours(splitEndTime[0], splitEndTime[1]);
      //   this.employeeShift.finishTime = new Date(endTime);
      // }
    }else{
      this.employeeShift.startTime = null;
      this.employeeShift.finishTime = null;
    }
  }

  save() {
    // console.log('@beforeSaved', this.employeeShift);return;
    const temp = Object.assign({}, this.employeeShift);

    // if (temp.startTime) {
    //   temp.startTime = ConvertUtil.localDateShiftAsUTC(temp.startTime);
    // } if (temp.finishTime) {
    //   temp.finishTime = ConvertUtil.localDateShiftAsUTC(temp.finishTime);
    // }

    this.loaderService.showLoader();
    this._employeeSvc.save(temp)
      .then((empShift: any) => {
        this.loaderService.hideLoader();
        // console.log('@returnAfterSave', empShift);

        this.utilities.showSuccessToast('saved successfully');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  reset() {
    this.employeeShift = {
      active: true,
      employeeGenericGroupId: null,
      employeeGroupId: null,
      employeeIdList: null,
      startDate: null,
      startTime: null,
      finishDate: null,
      finishTime: null,
      groupCode: null,
      groupName: null,
      shiftId: null,
      plantId: this.selectedPlant ? this.selectedPlant.plantId : null
    }
  }
}
