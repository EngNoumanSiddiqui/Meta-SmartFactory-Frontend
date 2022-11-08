import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, Message } from 'primeng';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from '../../../../../environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
@Component({
  selector: 'app-employee-detail-groups-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeDetailGroupsListComponent implements OnInit {

  @Input('data') set i(setData) {
    if (setData) {
      this.staff = setData;
    }
  }



  employeeId;

  @ViewChild('myModal') public myModal: ModalDirective;
  skillModal = {
    modal: null,
    id: null
  };
  status = null;


  staff = [];

  /********* DataTable settings*************/
  selectedCapability;
  showLoader = false;
  selectedColumns = [
    { field: 'groupCode', header: 'group-code' },
    { field: 'groupName', header: 'group-name' },
    { field: 'shift', header: 'shift' },
    { field: 'startDate', header: 'start-date' },
    { field: 'finishDate', header: 'finish-date' },
    { field: 'startTime', header: 'start-time' },
    { field: 'updafinishTimeteDate', header: 'finish-time' },
  ];

  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  capabilities = [] = [];



  pageFilter =
    {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      createDate: null,
      employeeId: null,
      employeeName: null,
      employeeSkillMatrixId: null,
      interest: null,
      note: null,
      proficiency: null,
      skillMatrixId: null,
      skillMatrixName: null,
      updateDate: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null
    };

  /********* DataTable settings*************/
  constructor(private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _employeeSkillsSrv: EmployeeSkillService,
    private _employeeSrv: EmployeeService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {



  }


  filter(data) {
    this.loaderService.showLoader();
    this._employeeSkillsSrv.filter(data)
      .then(result => {

        this.capabilities = result['content'];
        this.loaderService.hideLoader();
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }




  modalShow(id, mod: string) {
    console.log('@OnEdit', id, mod);
    this.skillModal.id = id;
    this.skillModal.modal = mod;
    this.myModal.show();
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._employeeSkillsSrv.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
