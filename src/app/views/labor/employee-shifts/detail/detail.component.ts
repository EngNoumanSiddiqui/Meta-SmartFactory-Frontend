import {Component, Input, OnInit} from '@angular/core';
import {EmployeeGenericGroupService} from '../../../../services/dto-services/employee-generic-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {EmployeeGroupService} from '../../../../services/dto-services/employee-group.service';

@Component({
  selector: 'shift-definition-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  groupId: number;
  employeeId: number;

  showGroupList = false;
  employeeShift = {
    employeeDto: null,
    employeeGroupDto: null,
    shiftDto: null,
    startTime: null,
    endTime: null,
    createDate: null,
    updateDate: null
  };

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
              private utilities: UtilitiesService) { }
  ngOnInit() {
  }

  private initialize(groupId, employeeId) {
    this.loaderService.showLoader();
    if (groupId) {
      this.employeeShiftService.getGroupShift(groupId).then((result: any) => {
        this.loaderService.hideLoader();
        this.employeeShift = result;
        if (this.employeeShift.employeeDto) {
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
        this.employeeShift = result;
        if (this.employeeShift.employeeDto) {
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

  convertTime(hms){
    if(hms){
      var ts = hms;
      var H = +ts.substr(0, 2);
      var h: any = (H % 12) || 12;
      h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
      var ampm = H < 12 ? " AM" : " PM";
      ts = h + ts.substr(2, 3) + ampm;
      return ts;
    }
    return '';
  }
}
