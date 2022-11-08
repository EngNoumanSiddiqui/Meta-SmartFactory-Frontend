import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EmployeeGroupService} from 'app/services/dto-services/employee-group.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from 'environments/environment';
import {ShiftSettingsService} from 'app/services/dto-services/shift-setting/shift-setting.service';
 
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'shift-definition-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  groupId: number;
  employeeId: number;

  showGroupList = false;
  employees = [];
  employeeGroup = [];
  shiftSettingList = [];

  employeeShiftResponse = {
    employeeDto: null,
    employeeGroupDto: null,
    shiftDto: null,
    startTime: null,
    endTime: null,
    createDate: null,
    updateDate: null,
    plantId:null
  };

  @Output() saveAction = new EventEmitter<any>();
  /*******formModle*******/
  employeeShift = {
    employeeGroupId: null,
    employeeId: null,
    shiftId: null,
    plantId: null
  };


  nonGroupEmpPageFilter =
    {
      pageNumber: 1,
      pageSize: 100000,
      employeeGroupId: null,
      groupCode: null,
      groupName: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null
    };
  groupEmpPageFilter = {
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 100000,
    query: null
  };
  selectedPlant: any;

  @Input('groupId') set z(groupId) {
    this.groupId = groupId;
    if (groupId) {
      this.initialize(this.groupId, this.employeeId);
    }
  };

  @Input('employeeId') set employeeIdSetter(employeeId) {
    this.employeeId = employeeId;
    if (employeeId) {
      this.initialize(this.groupId, this.employeeId);
    }
  };

  constructor(private employeeShiftService: EmployeeGroupService,
    private _router: Router,
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private userSvc: UsersService,
    private _shiftService: ShiftSettingsService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService) {
    this.selectedPlant = JSON.parse(this.userSvc.getPlant());
    this.employeeShift.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
  }

  private initialize(groupId, employeeId) {
    this.loaderService.showLoader();
    if (groupId) {
      this.employeeShiftService.getGroupShift(groupId).then((result: any) => {
        this.loaderService.hideLoader();
        this.employeeShiftResponse = result;

        this.employeeShift = this.setEmployeeShiftRequestObject(this.employeeShiftResponse);
        // this.employeeShift.employeeId = this.employeeShiftResponse.employeeDto.employeeId;
        // this.employeeShift.employeeGroupId = this.employeeShiftResponse.employeeGroupDto.employeeGroupId;
        // this.employeeShift.employeeId = this.employeeShiftResponse.employeeDto.employeeId;
        // this.employeeShift.employeeId = this.employeeShiftResponse.employeeDto.employeeId;

        if (this.employeeShiftResponse.employeeDto) {
          this.showGroupList = false;
        } else {
          this.showGroupList = true;
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    } else {
      this.employeeShiftService.getEmployeeShift(employeeId).then((result: any) => {
        this.loaderService.hideLoader();
        this.employeeShiftResponse = result;
        this.employeeShift = this.setEmployeeShiftRequestObject(this.employeeShiftResponse);
        if (this.employeeShiftResponse.employeeDto) {
          this.showGroupList = false;
        } else {
          this.showGroupList = true;
        }
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    }
  }

  ngOnInit() {
    this.getNonGroupedEmployee(this.nonGroupEmpPageFilter);
    this.getGroupedEmployee(this.groupEmpPageFilter);
    this.getShiftList();
    // console.log("showHide",this.showHide);
    // console.log("status",this.hideEmployeeList);
    // console.log("statusGroup",this.hideEmployeeGroup);
  }

  getNonGroupedEmployee(data) {
    this.loaderService.showLoader();
    this._employeeSvc.search(data)
      .then(result => {
        this.employees = result['content'];
        this.loaderService.hideLoader();
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
        console.log('GroupedDataShape', this.employeeGroup);
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  getShiftList() {
    if (this.selectedPlant) {
      this._shiftService.getShiftSettingsListByPlantId(this.selectedPlant?.plantId).then((result: any) => {
        this.shiftSettingList = result;
        console.log('shiftSetting', this.shiftSettingList);
      });
    } else {
      this._shiftService.getShiftSettingsList().then((result: any) => {
        this.shiftSettingList = result;
        console.log('shiftSetting', this.shiftSettingList);
      });
    }
  }

  save() {
    this.loaderService.showLoader();
    console.log('@beforeSaved', this.employeeShift);
    this._employeeSvc.saveEmployeeShift(this.employeeShift)
      .then((empShift: any) => {
        this.loaderService.hideLoader();
        console.log('@returnAfterSave', empShift)
        this.utilities.showSuccessToast('Employee Shift' + empShift + 'saved successfully');
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

  private setEmployeeShiftRequestObject(employeeShiftResponse ) {
    const employeeShift = {
      employeeGroupId: employeeShiftResponse.employeeGroupDto !== null ? employeeShiftResponse.employeeGroupDto.employeeGroupId : null,
      employeeId: employeeShiftResponse.employeeDto !== null ? employeeShiftResponse.employeeDto.employeeId : null,
      shiftId: employeeShiftResponse.shiftDto !== null ? employeeShiftResponse.shiftDto.shiftId : null,
      plantId: employeeShiftResponse.plantId
    };
    return employeeShift;
  }

  reset() {
    this.employeeShift = {
      // active:false,
      employeeGroupId: null,
      employeeId: null,
      shiftId: null,
      plantId:null
    }
  }

  setEmployee(event) {
    console.log('@setEmployee', event)
    this.employeeShift.employeeId = event.employeeId;
    this.employeeShift.employeeGroupId = null;
  }

  setEmployeeGroup(event){
    this.employeeShift.employeeId =null;
  }
}
