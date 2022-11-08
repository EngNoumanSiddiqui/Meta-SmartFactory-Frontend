import { EmployeeGroupService } from './../../../../services/dto-services/employee-group.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, Message } from 'primeng';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { environment } from '../../../../../environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'emp-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEmployeeComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  employeeGroupModal = {
    modal: null,
    id: null
  };
  /********* DataTable settings*************/
  selectedEmpGroup;
  showLoader = false;
  selectedColumns = [
    { field: 'groupCode', header: 'group-code' },
    { field: 'groupName', header: 'group-name' }
  ];
  cols = [
    { field: 'groupCode', header: 'group-code' },
    { field: 'groupName', header: 'group-name' }
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  employees = [] = [];

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
      employeeGroupId: null,
      groupCode: null,
      plantId: null,
      groupName: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null
    };
  sub: Subscription;

  /********* DataTable settings*************/
  constructor(private _confirmationSvc: ConfirmationService,
    private _router: Router,
    private _translateSvc: TranslateService,
    private _employeeSvc: EmployeeGroupService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        // this.pageFilter.plantName = null;
      } else {
        // this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
      }
      this.filter(this.pageFilter);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


  filter(data) {
    this.loaderService.showLoader();
    this._employeeSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.employees = result['content'];
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
    if (item === 'employeeTitleName') // fix require
    {
      this.pageFilter.orderByProperty = 'et.employeeTitleName';
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
    this.employeeGroupModal.id = id;
    this.employeeGroupModal.modal = mod;
    this.myModal.show();
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._employeeSvc.delete(id)
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
