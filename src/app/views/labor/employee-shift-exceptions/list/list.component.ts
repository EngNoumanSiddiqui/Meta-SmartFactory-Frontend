import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EmployeeGroupService} from 'app/services/dto-services/employee-group.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from 'environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import {Subscription} from "rxjs";
 
import {AppStateService} from '../../../../services/dto-services/app-state.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEmployeeShiftExceptionComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  employeeGroupModal = {
    modal: null,
    id: null
  };
  /********* DataTable settings*************/
  selectedEmpGroup;
  showLoader = false;
  selectedColumns = [
    {field: 'employeeDto', header: 'employee'},
    {field: 'exceptionType', header: 'type'},
    {field: 'shiftDto', header: 'shift'},
    {field: 'startTime', header: 'start-date'},
    {field: 'endTime', header: 'finish-date'},
    {field: 'confirmationState', header: 'status'},
  ];
  cols = [
    {field: 'employeeDto', header: 'employee'},
    {field: 'exceptionType', header: 'type'},
    {field: 'shiftDto', header: 'shift'},
    {field: 'startTime', header: 'start-date'},
    {field: 'endTime', header: 'finish-date'},
    {field: 'confirmationState', header: 'status'},
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  employees = [];

  selectedPlant: any;
  confirmationState = ['NEW', 'CONFIRMED', 'REJECTED']
  sub: Subscription;

  /********* DataTable settings*************/
  constructor(private _confirmationSvc: ConfirmationService,
              private _router: Router,
              private _translateSvc: TranslateService,
              private _employeeSvc: EmployeeGroupService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private appStateService: AppStateService) {
    // this.selectedPlant = JSON.parse(this._userSvc.getPlant());
    // this.pageFilter.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res)) {
        this.pageFilter.plantId = res.plantId;
        this.selectedPlant = res;
      } else {
        this.pageFilter.plantId = null;
        this.selectedPlant = null;
      }
      this.filter(this.pageFilter);
    });
  }

  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this._employeeSvc.filterEmployeeShiftException(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.employees = result['content'];
        console.log('exc',this.employees);
        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

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
      confirmationState: null,
      plantId: null,
      employeeId: null,
      groupId: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null,
      startTime: null,
      endTime: null,
      type: null
    };

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

  //fix require
  reOrderData(id, item: string) {
    if (item === 'employeeTitleName') {
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
        this._employeeSvc.deleteEmpShiftExceptions(id)
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

  accept(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-confirm'),
      header: this._translateSvc.instant('accept-confirmation'),
      icon: 'fa fa-check',
      accept: () => {
        this._employeeSvc.acceptEmployeeExceptionalShift(id).then(result => {
          //console.log("#accept",result);
          this.utilities.showSuccessToast('confirm-success');
          this.filter(this.pageFilter);
        }).catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  reject(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-reject'),
      header: this._translateSvc.instant('reject-confirmation'),
      icon: 'fa fa-check',
      accept: () => {
        this._employeeSvc.rejectEmployeeExceptionalShift(id).then(result => {
          //console.log("#reject",result);
          this.utilities.showSuccessToast('reject-success');
          this.filter(this.pageFilter);
        }).catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  showStaffDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }
  showShiftDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, id);
  }

}
