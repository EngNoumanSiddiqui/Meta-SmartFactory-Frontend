
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from 'environments/environment';

import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { Subject } from 'rxjs';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';

@Component({
  selector: 'skills-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EmployeeSkillsEditComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      
      this.initialize(this.id);
    }
  };

  selectedEmployeeFromList: any;

  payLoadObject = {
      employeeId: null,
      employeeSkillMatrixId: null,
      interest: null,
      note: null,
      proficiency: null,
      skillMatrixId: null
    }
  capRequest = {
    skillMatrixId: null,
    proficiency: 0,
    interest: 0,
    note: '',
    employeeId: 1
  }
  categories: any[];
 obj = { skillMatrixCategoryId: null, selectedEmployee: {employeeId: null}};
  capabilities: any[];
  empList: any;
  private searchTerms = new Subject();
  constructor(
              private _skillsSrv: EmployeeSkillService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
            
              private _empSvc: EmployeeService,
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
    this. capRequest = {
      skillMatrixId: null,
      proficiency: 0,
      interest: 0,
      note: '',
      employeeId: null

    };
    
  }

  save() {

    // this.capRequest.employeeId = this.selectedEmployeeFromList.employeeId;
    this.loaderService.showLoader();
    this._skillsSrv.save(this.capRequest)
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

  categorySelection(event) {
    
  }

  initialize(id) {
    this.capRequest.skillMatrixId = this.id;
    this._skillsSrv.getDetail(id).then((result: any) => {
      // this.capRequest.employeeId=result.employee.employeeId;
    // this.selectedEmployeeFromList.employeeId=result.employee.employeeId;
      this.capRequest.interest = result.interest;
      this.capRequest.proficiency = result.proficiency;
      this.capRequest.skillMatrixId = result.skillMatrix.skillMatrixId;
      this.capRequest.note = result.note;
      this.capRequest.employeeId = result.employee.employeeId;
      this.selectedEmployeeFromList = result.employee;
      this.capRequest.skillMatrixId = result.skillMatrix.skillMatrixId;
      this.obj.skillMatrixCategoryId = result.skillMatrix.skillMatrixCategory.skillMatrixCategoryId;
    });
  }
}
