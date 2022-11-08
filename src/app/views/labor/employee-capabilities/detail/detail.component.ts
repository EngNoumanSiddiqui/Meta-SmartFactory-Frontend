import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PermissionGroupService } from 'app/services/dto-services/permissions/permission-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';

@Component({
  selector: 'capability-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class EmployeeCapabilityDetailComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  capRequest;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input('data') set zData(data) {
    if (data) {
      this.capRequest = data;
    }
  };



  // capRequest = {
  //   skillMatrixId: 0,
  //   skillMatrixCode: '',
  //   skillMatrixName: '',
  //   groupType: null,
  //   maxProficiency: 0,
  //   minProficiency: 0,
  //   maxInterest: 0,
  //   minInterest: 0,
  //   skillMatrixDescription: ''

  // }
  constructor(private _permissionSvc: PermissionGroupService,
    private _capabilitySvc: EmployeeCapabilityService,
    private _route: ActivatedRoute,
    private _router: Router, private utilities: UtilitiesService,
    private loaderService: LoaderService) {


}

  ngOnInit() {
  }

 



initialize(id) {
  this._capabilitySvc.getDetail(id).then((result: any) => {
    this.capRequest = result;
  });
}}
