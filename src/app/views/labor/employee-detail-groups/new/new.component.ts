
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

import { environment } from 'environments/environment';

import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EmployeeGenericGroupService } from 'app/services/dto-services/employee-generic-group.service';



@Component({
  selector: 'employee-detail-groups-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class EmployeeDetailGroupsNewComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  @Input() isRemove: boolean;
  sub: Subscription;
  selectedGroup = 'g-group';
  @Input('id') set i(setId) {
    if (setId) {
      this.newShiftGroupRequest.employeeIdList.push(setId);
      this.selectedEmployeeId = setId;
    }
  }
  employeeGroupList;
  selectedEmployeeId;
  selectedEmployeeDetails;
  newShiftGroupRequest = {
    active: true,
    employeeGroupId: null,
    employeeIdList: [],

  };
  shiftGroupFilter = {
    employeeGroupId: null,
    groupCode: null,
    groupName: null,
    orderByDirection: "desc",
    orderByProperty: "employeeGroupId",
    pageNumber: 1,
    pageSize: 9999,
    plantId: null,
    startDate: null,
  };
  shiftGroupList: any;
  genericGroupList: any;

  constructor(
    private employeeShiftGroupSrv: EmployeeGroupService,
    private employeeService: EmployeeService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private employeeGenericGroupSrv: EmployeeGenericGroupService
  ) {
  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.shiftGroupFilter.plantId = null;

      } else {
        this.shiftGroupFilter.plantId = res.plantId;
      }
    });
    this.getDetails();

    this.filterGeneralGroups();
  }

  getDetails() {
    this.employeeService.getDetail(this.selectedEmployeeId).then((result: any) => {
      this.selectedEmployeeDetails = result;
      this.genericGroupList = result.employeeGenericGroupList;
      this.shiftGroupList = result.employeeShiftGroupList;

    });
  }

  shiftGroupChange(event) {
    this.newShiftGroupRequest.employeeGroupId = event;
  }

  filterShiftGroups() {
    this.loaderService.showLoader();
    this.employeeShiftGroupSrv.filter(this.shiftGroupFilter).then(result => {
      this.employeeGroupList = result;
      this.loaderService.hideLoader();
      console.log(result);
    }).catch(error => {
      this.loaderService.hideLoader();
      console.log(error)
    });
  }

  genericSave() {
    this.save(this.newShiftGroupRequest.employeeGroupId);
  }

  save(employeeGroupId) {
    if (this.selectedGroup == 's-group') {
      this.newShiftGroupRequest.employeeGroupId = employeeGroupId;
      this.loaderService.showLoader();
      this.employeeShiftGroupSrv.addShiftGroupMember(this.newShiftGroupRequest).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Saved Successfully');
        this.getDetails();
        // setTimeout(() => {
        //   this.saveAction.emit('close');

        // }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    } else if (this.selectedGroup == 'g-group') {
      this.newShiftGroupRequest.employeeGroupId = employeeGroupId;
      this.loaderService.showLoader();
      this.employeeGenericGroupSrv.addEmployeeGenericGroupSv(this.newShiftGroupRequest).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Saved Successfully');
        this.getDetails();
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    }
  }

  filterGeneralGroups() {
    this.loaderService.showLoader();
    this.employeeGenericGroupSrv.filterObs(this.shiftGroupFilter).subscribe(data => {
      this.loaderService.hideLoader();
      this.employeeGroupList = data;
    }, err => {
      this.loaderService.hideLoader();
      console.log(err)
    });
  }

  selectGroup(groupName: string) {
    this.newShiftGroupRequest.employeeGroupId = null;
    this.employeeGroupList = [];
    this.selectedGroup = groupName;
    if (groupName == 's-group') {
      this.filterShiftGroups();
    } else {
      this.filterGeneralGroups();
    }
  }

  remove(employeeGroupId) {
    if (this.selectedGroup == 'g-group') {
      let req = {
        "active": true,
        "employeeGroupId": employeeGroupId,
        "employeeIdList": [this.selectedEmployeeId]
      };
      this.loaderService.showLoader();
      this.employeeGenericGroupSrv.removeGenericGroupMem(req).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Removed Successfully');
        this.getDetails();
        // setTimeout(() => {
        //   this.saveAction.emit('close');

        // }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    } else if (this.selectedGroup == 's-group') {
      let res = {
        "active": true,
        "employeeGroupId": employeeGroupId,
        "employeeIdList": [this.selectedEmployeeId]
      };
      this.loaderService.showLoader();
      this.employeeShiftGroupSrv.removeShiftGroupMem(res).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('Removed Successfully');
        this.getDetails();
        // setTimeout(() => {
        //   this.saveAction.emit('close');
        // }, environment.DELAY);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
    }

  }
}
