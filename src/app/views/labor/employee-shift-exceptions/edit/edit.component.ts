
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import {UsersService} from '../../../../services/users/users.service';
@Component({
  selector: 'edit-emp-shift-exception',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditEmployeeShiftExceptionComponent implements OnInit {
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
    startTime: null
  }

  selectedPlant: any;

  groupEmpPageFilter = {
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    plantId: null
  };
/***editcase*/
  id;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
/***editcase*/
  constructor(
    private _enumService: EnumService,
    private _shiftService: ShiftSettingsService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _userSvc: UsersService) {
  this.selectedPlant = JSON.parse(this._userSvc.getPlant());
  this.groupEmpPageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
}

    ngOnInit() {

      this.getGroupedEmployee(this.groupEmpPageFilter);
      this.getShiftList();
      this.getExceptionalTypeList();
      if (this.showHide === false) {
        this.hideEmployeeList = true;
      } else {
        this.hideEmployeeGroup = true;
      }
    }

    private initialize(id) {
      this.employeeShiftExceptions.employeeShiftsExceptionId = this.id;
      this.loaderService.showLoader();
      this._employeeSvc.getEmployeeExceptionalShiftDetail(id).then((result: any) => {
      this.loaderService.hideLoader();
      this.employeeShiftExceptions = result;
        if (result.employeeDto) {
          this.employeeShiftExceptions.employeeId = result.employeeDto.employeeId;
        }
        if (result.exceptionType) {
          this.employeeShiftExceptions.exceptionalTypesEnum = result.exceptionType;
        }
        // shiftDto
        if (result.startTime) {
          this.employeeShiftExceptions.startTime = new Date(result.startTime);
        }

        if (result.endTime) {
          this.employeeShiftExceptions.endTime = new Date(result.endTime);
          // this.employeeShiftExceptions.endTime = new Date(moment(result.endTime).utc().format());
        }
        if (result.shiftDto) {
          this.employeeShiftExceptions.shiftId = result.shiftDto.shiftId;
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
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
        startTime: null
    }
  }

}
