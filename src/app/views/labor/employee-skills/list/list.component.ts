import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {ConfirmationService, Message} from 'primeng';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'app-employee-skills-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EmployeeSkillsListComponent implements OnInit {

  @Input('id') set i (setid) {
    if (setid.id) {
      this.pageFilter.employeeId = setid.id;
      this.status = setid.status;
      this.filter(this.pageFilter);
    }
  }
  @ViewChild('myModal') public myModal: ModalDirective;
  skillModal = {
    modal: null,
    id: null
  };
  status = null;
  /********* DataTable settings*************/
  selectedCapability;
  showLoader = false;
  selectedColumns = [
    {field: 'employeeSkillMatrixId', header: 'employee-skill-id'},
    {field: 'employee', header: 'employee'},
    {field: 'skillMatrix', header: 'capability'},
    {field: 'proficiency', header: 'proficiency'},
    {field: 'interest', header: 'interest'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
    {field: 'note', header: 'note'},
  ];
  cols = [
    {field: 'employeeSkillMatrixId', header: 'employee-skill-id'},
    {field: 'employee', header: 'employee'},
    {field: 'skillMatrix', header: 'capability'},
    {field: 'proficiency', header: 'proficiency'},
    {field: 'interest', header: 'interest'},
    {field: 'createDate', header: 'createDate'},
    {field: 'updateDate', header: 'updateDate'},
    {field: 'note', header: 'note'},
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  capabilities = [] = [];

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };

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
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.filter(this.pageFilter);
  }


  filter(data) {
    this.loaderService.showLoader();
    this._employeeSkillsSrv.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.capabilities = result['content'];
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;
    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;
    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 500);
  }

  reOrderData(id, item: string) {
    if (item === 'capabilityCode') {
      this.pageFilter.orderByProperty = 'et.capabilityCode';
    } else {
      this.pageFilter.orderByProperty = item;
    }
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
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
  // intialize(id) {
  //   this.pageFilter.employeeId = id;
  // }

  showEmployeeDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }
  showCapabilityDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.EMPLOYEECAPABILITY, id);
  }
}
