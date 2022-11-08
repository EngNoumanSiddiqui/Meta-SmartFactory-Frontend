import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
 
import {AppStateService} from '../../../../services/dto-services/app-state.service';
import {Subscription} from "rxjs";
@Component({
  selector: 'shift-exception-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  employeeGroup = [];
  shiftSettingList = [];
  exceptionTypesList = [];
  showHide = false;
  hideEmployeeList = false;
  hideEmployeeGroup = false;

  employeeShiftExceptions = {
    employeeGroupId: null,
    employeeId: null,
    employeeShiftsExceptionId: null,
    endTime: null,
    exceptionalTypesEnum: null,
    shiftId: null,
    startTime: null,
    plantId: null
  }

  selectedPlant: any;
  sub: Subscription;

  groupEmpPageFilter = {
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    plantId: null
  };

  constructor(
    private _enumService: EnumService,
    private _shiftService: ShiftSettingsService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private appStateService: AppStateService) {
    // this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    // this.groupEmpPageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res)) {
        this.selectedPlant = res;
        this.employeeShiftExceptions.plantId = res.plantId;
        this.groupEmpPageFilter.plantId = res.plantId;
      } else {
        this.selectedPlant = null;
        this.employeeShiftExceptions.plantId = null;
        this.groupEmpPageFilter.plantId = null;
      }
      this.getGroupedEmployee(this.groupEmpPageFilter);
      this.getShiftList();
    });
  }

ngOnInit() {
    this.getGroupedEmployee(this.groupEmpPageFilter);
    this.getShiftList();
    this.getExceptionalTypeList();
    if (this.showHide == false) {
      this.hideEmployeeList = true;
    } else {
      this.hideEmployeeGroup = true;
    }
  }



getGroupedEmployee(data) {
    this.loaderService.showLoader();
    this._employeeSvc.filter(data)
      .then(result => {
      this.employeeGroup = result['content'];
      this.loaderService.hideLoader();
    }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

getShiftList() {
    const plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this._shiftService.getShiftSettingsListByPlantId(plantId).then((result: any) => {
      this.shiftSettingList = result;
    });
  }
getExceptionalTypeList() {
  this._enumService.EmployeeShiftsExceptionalTypes().then((result: any) => {
    this.exceptionTypesList = result;
  });
}
showHideEmployeeList(value) {
  if (value === true) {
    this.hideEmployeeList = false;
    this.hideEmployeeGroup = true;
    this.employeeShiftExceptions.employeeId = null;
  } else {
    this.hideEmployeeList = true;
    this.hideEmployeeGroup = false;
    this.employeeShiftExceptions.employeeGroupId = null;
  }
}
save() {
    this.loaderService.showLoader();
    this._employeeSvc.saveEmployeeShiftsExceptions(this.employeeShiftExceptions)
      .then((empShiftException: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Employee Shift Exception' + empShiftException + 'saved successfully');
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
    this.employeeShiftExceptions = {
      employeeGroupId: null,
      employeeId: null,
      employeeShiftsExceptionId: null,
      endTime: null,
      exceptionalTypesEnum: null,
      shiftId: null,
      startTime: null,
      plantId: this.selectedPlant ? this.selectedPlant.plantId : null
  }
}
}
