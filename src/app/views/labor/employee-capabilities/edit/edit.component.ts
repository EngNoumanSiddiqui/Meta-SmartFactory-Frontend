import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'capability-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;
  groupTypeList: any;

  @Input("plantId") set setPlantID(plantId) {
    if(plantId) {
      this.capRequest.plantId = plantId;
    }
  }
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set zData(data) {
    if (data) {
      this.capRequest.skillMatrixId = data.skillMatrixId;
      this.capRequest.skillMatrixCode = data.skillMatrixCode;
      this.capRequest.skillMatrixName = data.skillMatrixName;
      this.capRequest.maxProficiency = data.maxProficiency;
      this.capRequest.plantId = this.capRequest.plantId;
      this.capRequest.minProficiency = data.minProficiency;
      this.capRequest.groupType = data.skillMatrixCategory?.groupType;
      this.capRequest.maxInterest = data.maxInterest;
      this.capRequest.minInterest = data.minInterest;
      this.capRequest.skillMatrixDescription = data.skillMatrixDescription;
      this.capRequest.skillMatrixCategoryId = data.skillMatrixCategory?.skillMatrixCategoryId
    }
  };
  /*******PickList********/
  capRequest = {
    skillMatrixCode: '',
    skillMatrixName: '',
    groupType: null,
    maxProficiency: 0,
    minProficiency: 0,
    maxInterest: 0,
    plantId: null,
    minInterest: 0,
    skillMatrixDescription: '',
    skillMatrixCategoryId: null,
    
    skillMatrixId: null

  }
  categories: any[];
 obj = { skillMatrixCategoryId: null};
  capabilities: any[];
  empList: any;
constructor(
            private _capabilitySrv: EmployeeCapabilityService,
            private utilities: UtilitiesService,
            private loaderService: LoaderService,
            private enumService: EnumService,
            private _empSvc: EmployeeService
            ) {
            }  

ngOnInit() {
  
  // this.filterCategory(data);
  this.enumService.getSkillMatrixGroupTypeEnum().then(res =>  this.groupTypeList = res).catch(err => console.error(err));
  
}
onSelectEmployeeCategory(event) {
  if(event) {
    this.capRequest.skillMatrixCategoryId = event.skillMatrixCategoryId;
  }
  
}
reset() {
  this. capRequest = {
    skillMatrixCode: '',
    groupType: null,
    skillMatrixName: '',
    plantId: this.capRequest.plantId,
    maxProficiency: 0,
    minProficiency: 0,
    maxInterest: 0,
    minInterest: 0,
    skillMatrixDescription: '',
    skillMatrixCategoryId: null,
    
    skillMatrixId: this.id

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





initialize(id) {
  this.capRequest.skillMatrixId = this.id;
  this._capabilitySrv.getDetail(id).then((result: any) => {
    this.capRequest.skillMatrixCode = result.skillMatrixCode;
    this.capRequest.skillMatrixName = result.skillMatrixName;
    this.capRequest.maxProficiency = result.maxProficiency;
    this.capRequest.minProficiency = result.minProficiency;
    this.capRequest.groupType = result.skillMatrixCategory?.groupType;
    this.capRequest.maxInterest = result.maxInterest;
    this.capRequest.minInterest = result.minInterest;
    this.capRequest.skillMatrixDescription = result.skillMatrixDescription;
    this.capRequest.skillMatrixCategoryId = result.skillMatrixCategory?.skillMatrixCategoryId

  });
}
}
