import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UsersService } from 'app/services/users/users.service';
import { ConvertUtil } from 'app/util/convert-util';
@Component({
  selector: 'emp-shift-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
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
    shiftId: null
  };

  selectedPlant: any;

  selectedEmployee: any;

  empGenericList = [];

  shiftList = [];

  members: any;

  constructor(
    private userSvc: UsersService,
    private _employeeSvc: EmployeeGroupService
    ) {

    this.selectedPlant = JSON.parse(this.userSvc.getPlant());
    }

  ngOnInit() {}

  initialize(id){
    this._employeeSvc.getDetail(id).then((res:any) => {
      if(res){

        this.employeeShift.finishTime= ConvertUtil.UTCTime2LocalTime(res.finishTime);
        this.employeeShift.startTime= ConvertUtil.UTCTime2LocalTime(res.startTime);
        this.employeeShift.startDate = res.startDate;
        this.employeeShift.finishDate = res.finishDate;
        if(res.employeeGenericGroup){
          this.employeeShift.employeeGenericGroupId = res.employeeGenericGroup.employeeGenericGroupId;
        }
        if(res.shift){
          this.employeeShift.shiftId = res.shift.shiftId;
        }
        this.employeeShift.groupCode = res.groupCode;
        this.employeeShift.groupName = res.groupName;
        this.employeeShift.employeeGroupId = res.employeeGroupId;
        this.employeeShift.active = res.active;
        this.members = res.members;
      }
    });
  }

}
