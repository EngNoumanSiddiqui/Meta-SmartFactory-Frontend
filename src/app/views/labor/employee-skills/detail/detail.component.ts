import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PermissionGroupService } from 'app/services/dto-services/permissions/permission-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';

@Component({
  selector: 'skills-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class EmployeeSkillsDetailComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  employeeName: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  capRequest = {
    skillMatrixName: null,
    proficiency: null,
    interest: null,
    note: null,
    employeeName: null,
    skillMatrixCategory: null
  }

 
  constructor(private _permissionSvc: PermissionGroupService,
    private _skillsSvc: EmployeeSkillService,
    private _route: ActivatedRoute,
    private _router: Router, private utilities: UtilitiesService,
    private loaderService: LoaderService) {


}

  ngOnInit() {
  }

 



initialize(id) {
  this._skillsSvc.getDetail(id).then((result: any) => {

    this.employeeName = result.employee.firstName;
    this.capRequest.interest = result.interest;
    this.capRequest.proficiency = result.proficiency;
    this.capRequest.skillMatrixName = result.skillMatrix.skillMatrixId;
    this.capRequest.note = result.note;
    this.capRequest.employeeName = result.employee.firstName + ' ' + result.employee.lastName;
    this.capRequest.skillMatrixCategory = result.skillMatrixId.skillMatrixCategory;
  });
}}
