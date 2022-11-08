import { filter } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import {DropdownModule} from 'primeng/dropdown';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'capability-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;

  @Input("plantId") set setPlantID(plantId) {
    if(plantId) {
      this.capRequest.plantId = plantId;
    }
  }
  /*******PickList********/
  capRequest = {
    skillMatrixCode: 'CC',
    skillMatrixName: '',
    maxProficiency: null,
    minProficiency: null,
    groupType: null,
    plantId: null,
    maxInterest: null,
    minInterest: null,
    skillMatrixDescription: '',
    skillMatrixCategoryId: null,
    employeeId: null

  }
  categories: any[];
 obj = { skillMatrixCategoryId: null};
  capabilities: any[];
  empList: any;
  groupTypeList: any;
constructor(
            private _capabilitySrv: EmployeeCapabilityService,
            private utilities: UtilitiesService,
            private loaderService: LoaderService,
            private enumService: EnumService,
            private _empSvc: EmployeeService
            ) {
            }  

ngOnInit() {
  this.enumService.getSkillMatrixGroupTypeEnum().then(res =>  this.groupTypeList = res).catch(err => console.error(err));
}

reset() {
  this. capRequest = {
    skillMatrixCode: '',
    skillMatrixName: '',
    groupType: null,
    maxProficiency: 0,
    minProficiency: 0,
    plantId : this.capRequest.plantId,
    maxInterest: 0,
    minInterest: 0,
    skillMatrixDescription: '',
    skillMatrixCategoryId: null,
    employeeId: null
  };
  
}

save() {
  // console.log("@beforeSaved",this.empGroupCode);
  this.loaderService.showLoader();
  this._capabilitySrv.save(this.capRequest)
    .then((groupMember: any) => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('Capability Member ' + groupMember.skillMatrixName + ' saved successfully');
     
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
filter(data) {
  this._capabilitySrv.filter(data)
    .then(result => {
    
      this.capabilities = result['content'];
      
    }).catch(error => {
  
    this.utilities.showErrorToast(error)
  });
}
onSelectEmployeeCategory(event) {
  if(event) {
    this.capRequest.skillMatrixCategoryId = event.skillMatrixCategoryId;
  }
}


}
