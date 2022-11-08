import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'edit-group-defination',
  templateUrl: './edit-group-defination.component.html',
  styleUrls: ['./edit-group-defination.component.scss']
})
export class EditGroupDefinationComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  /*******PickList********/
  sourceEmployeeList;
  targetEmployeeList;
 /******PickList*********/ 
  empGroupCode =
  {
    active: false,
    employeeGroupId: null,
    employeeIdList: [],
    groupCode: null,
    groupName: null,
    plantId: null
  }

  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
      this.targetEmployeeList = [];
    }
  };
  constructor(private _empGroupSvc: EmployeeGroupService,
              private _router: Router,
              private _route: ActivatedRoute,
              private _userSvc: UsersService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
              }
  ngOnInit() {
    this._empGroupSvc.getAllEmployees({
      pageNumber: 1,
      pageSize: 9999,
      plantId: this.selectedPlant.plantId,
      orderByDirection: 'desc',
      orderByProperty: 'employeeId',
    }).then(result => {
      this.sourceEmployeeList = result['content'];
    });
    this.targetEmployeeList = [];
  }
  
  private initialize(id) {
    this.empGroupCode.employeeGroupId = this.id;
    this.loaderService.showLoader();
    this._empGroupSvc.getDetail(id).then((result: any) => {
      this.loaderService.hideLoader();
      if ((result['groupCode'])) {
        this.empGroupCode.groupCode = result['groupCode'];
      }
      if ((result['groupName'])) {
        this.empGroupCode.groupName = result['groupName'];
      }
      this.empGroupCode.plantId = this.selectedPlant?.plantId;
      if ((result['members'])) {
        result.members.forEach(element => {
          this.targetEmployeeList.push(element);
        });
      }
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

reset() {
  this.empGroupCode = {
    active: false,
    employeeGroupId: null,
    employeeIdList: [],
    plantId: this.selectedPlant?.plantId,
    groupCode: null,
    groupName: null
  }
}

save() {
  this.loaderService.showLoader();
  this.empGroupCode.employeeIdList = [];
  this.targetEmployeeList.forEach(element => {
    this.empGroupCode.employeeIdList.push(element.employeeId);
  });
  this._empGroupSvc.save(this.empGroupCode)
    .then((groupMember: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('Group Member' + groupMember.groupName + ' updated successfully');
      setTimeout(() => {
        // this.reset();
        this.saveAction.emit('close');
      }, environment.DELAY);
    })
    .catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
}
}
