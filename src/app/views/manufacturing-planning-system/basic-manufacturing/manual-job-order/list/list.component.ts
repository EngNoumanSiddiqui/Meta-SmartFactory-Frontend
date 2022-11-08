import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from 'primeng';
import {TranslateService} from '@ngx-translate/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ManualJobOrderService } from 'app/services/dto-services/manual-job-order/manual-job-order.service';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'manual-job-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListManualJobOrderComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  manualJobOrderModal = {
    modal: null,
    id: null
  };

  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'manualJobOrderId', header: 'manual-job-order-id'},
    {field: 'workStation', header: 'work-station'},
    {field: 'quantity', header: 'quantity'},
    {field: 'plannedTime', header: 'planned-time'},
    {field: 'maxStandbyTime', header: 'max-standby-time'},
    {field: 'description', header: 'description'}
  ];
  cols = [
    {field: 'manualJobOrderId', header: 'manual-job-order-id'},
    {field: 'workStation', header: 'work-station'},
    {field: 'quantity', header: 'quantity'},
    {field: 'plannedTime', header: 'planned-time'},
    {field: 'maxStandbyTime', header: 'max-standby-time'},
    {field: 'description', header: 'description'}
  ];

  modal = {active: false};
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    equipmentCodeGroupHeaderId: null,
    codeGroup: null,
    shortText: null,
    query: null,
    orderByProperty: 'equipmentCodeGroupHeaderId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private _manualJobOrderSvc: ManualJobOrderService) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    this.loaderService.showLoader();
    this._manualJobOrderSvc.getAll().subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        this.loaderService.hideLoader();
      }, error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
    });
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    // this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {
    this.manualJobOrderModal.id = id;
    this.manualJobOrderModal.modal = mod;
    this.modal.active = true;
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
    // this.filter(this.pageFilter)
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    // this.filter(this.pageFilter);
  }

  getIndex(index) {
    this.tableDetailIndex = index;
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      equipmentCodeGroupHeaderId: null,
      codeGroup: null,
      shortText: null,
      query: null,
      orderByProperty: 'equipmentCodeGroupHeaderId',
      orderByDirection: 'desc'
    };
    // this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._manualJobOrderSvc.delete(id).subscribe(
          result => {
            this.pagination.currentPage = result['currentPage'];
            this.pagination.totalElements = result['totalElements'];
            this.pagination.totalPages = result['totalPages'];
            this.tableData = result['content'];
            this.loaderService.hideLoader();
          }, error => {
            this.utilities.showErrorToast(error)
            this.loaderService.hideLoader();
        });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

}
