
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';

import { environment } from 'environments/environment';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';

@Component({
  selector: 'skills-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class EmployeeSkillsNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  selectedEmployeeFromList: any;

  capRequest = {
    skillMatrixId: null,
    proficiency: null,
    interest: null,
    note: null,
    employeeId: null
  };
  categories: any[];
  obj = { skillMatrixCategoryId: null, selectedEmployee: {employeeId: null}};
  capabilities: any[];
  empList: any;
constructor(
            private _skillsSrv: EmployeeSkillService,
            private utilities: UtilitiesService,
            private loaderService: LoaderService,
            private _capSrv: EmployeeCapabilityService,
            ) {
              
            }  

ngOnInit() {
  const data = {
    'category': null,
    'categoryCode': null,
    'orderByDirection': null,
    'orderByProperty': null,
    'pageNumber': 1,
    'pageSize': 9999,
    'query': null
  };
  this.filterCategory(data);
  
  
}

reset() {
  this.capRequest = {
    skillMatrixId: null,
    proficiency: 0,
    interest: 0,
    note: '',
    employeeId: null
  };
  
}

categorySelection($event) {

}

save() {
  // this.capRequest.employeeId = this.selectedEmployeeFromList.employeeId;
  this.loaderService.showLoader();
  this._skillsSrv.save(this.capRequest).then((groupMember: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('Capability Member ' + groupMember.skillMatrixName + ' saved successfully');
      setTimeout(() => {
        this.reset();
        this.saveAction.emit('close');
      }, environment.DELAY);
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  
}

filterCategory(data) {
  this._skillsSrv.filterCategory(data)
    .then(result => {
       this.categories = result['content'];
    }).catch(error => {
    this.utilities.showErrorToast(error)
  });
}
filter(data) {
  this._capSrv.filter(data)
    .then(result => {
      this.capabilities = result['content'];
    }).catch(error => {
    this.utilities.showErrorToast(error)
  });
}
onCategorySelction() {
  const cababilityData = {
    pageNumber: 1,
    pageSize: 9999,
    capabilityCode: null,
    cabability: null,
    maxProficiency: null,
    minProficiency: null,
    maxIntrest: null,
    minIntrest: null,
    description: null,
    orderByDirection: null,
    orderByProperty: null,
    query: null,
    skillMatrixCategoryId: this.obj.skillMatrixCategoryId
  };
  this.filter(cababilityData);
}


}
