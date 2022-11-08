import { Component, OnInit, Input } from '@angular/core';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'group-defination',
  templateUrl: './group-defination.component.html',
  styleUrls: ['./group-defination.component.scss']
})
export class GroupDefinationComponent implements OnInit {
  groupCodeDetail:any;
  hideRow:boolean=false;
  id;
  @Input('id') set z(id){
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  constructor(private _empGroupSvc:EmployeeGroupService,
    private _router: Router,
    private _route: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService) { }

  ngOnInit() {
  }

private initialize(id){
    this.loaderService.showLoader();
    this._empGroupSvc.getDetail(id).then((result:any) =>{
      this.loaderService.hideLoader();
      this.groupCodeDetail=result;
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  showEmployeeDetails(employeeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, employeeId);
  }
}
