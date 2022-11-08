import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';

import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { UsersService } from 'app/services/users/users.service';
import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';
import { ShiftSettingsResponseDto } from 'app/dto/shift/shift.dto';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'emp-shift-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();

  groupId: number;
  employeeId: number;


  @Input('groupId') set z(groupId) {
    this.groupId = groupId;
    if (groupId) {
      this.initialize(this.groupId);
    }
  };

  @Input('employeeId') set employeeIdSetter(employeeId) {
    this.employeeId = employeeId;
    if (employeeId) {
      // this.initialize(this.groupId, this.employeeId);
    }
  };

  @Input() isCloned= false;

  /*******formModle*******/
  employeeShift = {
    active: false,
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
    plantId: null,
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

  selectedEmployee: any;

  empGenericList = [];

  shiftList = [];

  members: any;

  constructor(
    private _shiftService: ShiftSettingsService,
    private userSvc: UsersService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _empGeneralSvc: EmployeeGenericGroupService) {

    this.selectedPlant = JSON.parse(this.userSvc.getPlant());
    this.employeeShift.plantId = this.selectedPlant?.plantId;
    // this.employeeShift.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.empGenericGroupFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null,
      this.empGenericGroupFilter.plantName = this.selectedPlant ? this.selectedPlant.plantName : null;
  }

  ngOnInit() {
    this.filter(this.empGenericGroupFilter);
    this.getShiftList();
  }




  initialize(id){
    this.loaderService.showLoader();
    this._employeeSvc.getDetail(id).then((res:any) => {
      if(res){
        this.loaderService.hideLoader();
        var date = new Date();
        if (res.startTime) {
          const splitStartTime:any = ConvertUtil.UTCTime2LocalTime(res.startTime).split(":", 2);
          let startTime = date.setHours(splitStartTime[0], splitStartTime[1]);
          this.employeeShift.startTime = this.isCloned? null : new Date(startTime);
        }
        if (res.finishTime) {
          const splitEndTime:any = ConvertUtil.UTCTime2LocalTime(res.finishTime).split(":", 2);
          let endTime = date.setHours(splitEndTime[0], splitEndTime[1]);
          this.employeeShift.finishTime = this.isCloned? null : new Date(endTime);
        }
        // if(res.createDate){
        //   this.employeeShift.createDate = new Date(res.createDate);
        // }
        if(res.startDate){
          this.employeeShift.startDate = new Date(res.startDate);
        }
        if(res.finishDate){
          this.employeeShift.finishDate = new Date(res.finishDate);
        }
        if(res.employeeGenericGroup){
          this.employeeShift.employeeGenericGroupId = res.employeeGenericGroup.employeeGenericGroupId;
        }
        if(res.shift){
          this.employeeShift.shiftId = this.isCloned? null : res.shift.shiftId;
        }
        if(res.members){
          this.employeeShift.employeeIdList = res.members.map(item => item.employeeId);
        }

        
          
      
       
        this.employeeShift.groupCode = this.isCloned? null : res.groupCode;
        this.employeeShift.groupName = this.isCloned? null : res.groupName;
        if(!this.isCloned) {
          this.employeeShift.employeeGroupId = res.employeeGroupId;
        } else {
          this.employeeShift.employeeGroupId = null;
        }
        this.employeeShift.active = res.active;
        this.members = res.members;
      }
    });
  }
  filter(data) {
    this._empGeneralSvc.filter(data)
      .then(result => {
        this.empGenericList = result['content'];
        // if(this.employeeShift.employeeGenericGroupId) {
        //   this.onShiftGroupChange(this.employeeShift.employeeGenericGroupId);
        // }
      }).catch(error => {
        this.utilities.showErrorToast(error)
      });
  }

  getShiftList() {
    this._shiftService.getShiftSettingsListByPlantId(this.empGenericGroupFilter.plantId).then((res: ShiftSettingsResponseDto[]) => {
      this.shiftList = res;
    });
  }


  updateMembers() {
    if (this.empGenericList.length > 0 && this.employeeShift.employeeGenericGroupId) {
      this.onShiftGroupChange(this.employeeShift.employeeGenericGroupId);
    }
  }

  onShiftGroupChange(event) {
    const shift = this.empGenericList.find(item => item.employeeGenericGroupId == event);
    if (shift) {
      // this.employeeShift.groupName = shift.groupName;
      // this.employeeShift.groupCode = shift.groupCode;
      this.employeeShift.employeeGenericGroupId = shift.employeeGenericGroupId;
      if (shift.members && shift.members.length > 0) {
        this.employeeShift.employeeIdList = shift.members.map(item => item.employeeId);
      }
      this.members = shift.members;
    } else {
      this.employeeShift.groupName = null;
      this.employeeShift.groupCode = null;
      this.employeeShift.employeeGenericGroupId = null;
      this.employeeShift.employeeIdList = null;
      this.members = [];
    }

  }

  onShiftChange(event) {

    const shift = this.shiftList.find(item => item.shiftId == event);
    if (shift) {
      var date = new Date();
      if (shift.startTime) {
        const splitStartTime:any = ConvertUtil.UTCTime2LocalTime(shift.startTime).split(":", 2);
        let startTime = date.setHours(splitStartTime[0], splitStartTime[1],0);
        this.employeeShift.startTime = new Date(startTime);
      }
      if (shift.endTime) {
        const splitEndTime:any = ConvertUtil.UTCTime2LocalTime(shift.endTime).split(":", 2);
        let endTime = date.setHours(splitEndTime[0], splitEndTime[1],0);
        this.employeeShift.finishTime = new Date(endTime);
      }
      // if (shift.startTime) {
      //   const splitStartTime = shift.startTime.split(":", 2);
      //   let startTime = date.setHours(splitStartTime[0], splitStartTime[1]);
      //   this.employeeShift.startTime = new Date(startTime);
      // }
      // if (shift.endTime) {
      //   const splitEndTime = shift.endTime.split(":", 2);
      //   let endTime = date.setHours(splitEndTime[0], splitEndTime[1]);
      //   this.employeeShift.finishTime = new Date(endTime);
      // }
    } else {
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

    temp.plantId = this.selectedPlant?.plantId;
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
      plantId: this.selectedPlant?.plantId
    }
  }

}
