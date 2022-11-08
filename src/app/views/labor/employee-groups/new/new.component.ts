
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'emp-group-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  /*******PickList********/
   sourceEmployeeList;
   targetEmployeeList;
  /******PickList*********/
  empGroupCode =
  {
    active: false,
    employeeIdList: [],
    groupCode: null,
    groupName: null,
    plantId: null,
  }
  selectedPlant: any;
constructor(
            private _empGroupSvc: EmployeeGroupService,
            private utilities: UtilitiesService,
            private _userSvc: UsersService,
            private loaderService: LoaderService) {
              const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
              
            }  

ngOnInit() {
  this.sourceEmployeeList = [];
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
  this.empGroupCode.employeeIdList = [];
  this.empGroupCode.plantId= this.selectedPlant?.plantId;
  // console.log("stateOn",this.empGroupCode.employeeIdList);
}


reset() {
  this.empGroupCode = {
    active: false,
    plantId: this.selectedPlant?.plantId,
    employeeIdList: [],
    groupCode: null,
    groupName: null
  }
}

save() {
  // console.log("@beforeSaved",this.empGroupCode);
  this.loaderService.showLoader();
  this.empGroupCode.employeeIdList = [];
  this.targetEmployeeList.forEach(element => {
    this.empGroupCode.employeeIdList.push(element.employeeId);
  });
  this._empGroupSvc.save(this.empGroupCode)
    .then((groupMember: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('Group Member' + groupMember.groupName + ' saved successfully');
      this.targetEmployeeList = [];
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
}
