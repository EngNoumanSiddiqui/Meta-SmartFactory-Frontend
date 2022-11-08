import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {EnumMaintenanceStatusService} from '../../../../services/dto-services/enum/maintenance-status.service';
import {MaintenanceService} from '../../../../services/dto-services/maintenance/maintenance.service';
import {EnumMaintenanceTypeService} from '../../../../services/dto-services/enum/maintenance-type.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMaintenanceComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  maintenanceModal = {
    modal: null,
    id: null
  };


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
  selectedMaintenances;

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,

    maintenanceNo: null,
    plannedDate: null,
    maintenanceType: null,
    maintenanceStatus: null,
    workStationName: null,

    query: null,
    orderByProperty: 'maintenanceId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc','asc', 'asc','asc', 'asc','asc', 'asc','asc', 'asc','asc', 'asc'];

  maintenances = [];

  listMaintenanceStatus;
  listMaintenanceTypes;

  showLoader = false;
  selectedColumns = [
    {field: 'maintenanceNo', header: 'maintenance-no'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'description', header: 'description'},
    {field: 'plannedDate', header: 'planned-date'},
    {field: 'finishTime', header: 'finish-time'},
    {field: 'maintenanceStatus', header: 'status'},
    {field: 'maintenanceType', header: 'type'}
  ];
  cols = [
    {field: 'maintenanceNo', header: 'maintenance-no'},
    {field: 'employeeFirstName', header: 'employee-first-name'},
    {field: 'employeeLastName', header: 'employee-last-name'},
    {field: 'description', header: 'description'},
    {field: 'finishTime', header: 'finish-time'},
    {field: 'maintenanceStatus', header: 'status'},
    {field: 'maintenanceType', header: 'type'},
    {field: 'plannedDate', header: 'planned-date'},
    {field: 'startTime', header: 'start-time'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'details', header: 'details'},
    {field: 'comments', header: 'comments'}
  ];

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.maintenanceModal.id = id;
    this.maintenanceModal.modal = mod;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumMaintenanceStatus: EnumMaintenanceStatusService,
              private _enumMaintenanceType: EnumMaintenanceTypeService,
              private _translateSvc: TranslateService,
              private _maintenanceSvc: MaintenanceService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }


  ngOnInit() {
    this.filter(this.pageFilter);
    this._enumMaintenanceStatus.getEnumList().then(result => this.listMaintenanceStatus = result).catch(error => console.log(error));
    this._enumMaintenanceType.getEnumList().then(result => this.listMaintenanceTypes = result).catch(error => console.log(error));
  }

  filter(data) {
    this.loaderService.showLoader();
    this._maintenanceSvc.filter(data)
      .then(result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.maintenances = result['content'];
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
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

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.pageFilter.orderByProperty = item;
    this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      plannedDate: null,
      maintenanceNo: null,
      maintenanceType: null,
      maintenanceStatus: null,
      workStationName: null,
      query: null,
      orderByProperty: 'maintenanceId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._maintenanceSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }


}

