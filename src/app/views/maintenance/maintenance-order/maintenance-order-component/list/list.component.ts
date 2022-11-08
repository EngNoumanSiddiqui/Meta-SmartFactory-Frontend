/**
 * Created by reis on 29.07.2019.
 */
import {Component, Input, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {MaintenanceOrderComponentService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order-component.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { ProductionOrderMaterialService } from 'app/services/dto-services/production-order/production-order-material.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'maintenance-order-component-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MaintenanceOrderComponentListComponent implements OnInit {
  @Output() reservationAndNotificationList = new EventEmitter<any>();
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null
  };
  private searchTerms = new Subject<any>();
  // tslint:disable-next-line: no-input-rename
  @Input('activeTab') activeTab: any;
  @Input('maintenanceOrderId') set e(maintenanceOrderId) {
    if (maintenanceOrderId) {
      this.pageFilter.maintenanceOrderId = maintenanceOrderId;
      this.filter(this.pageFilter);
    }

  }
  @Input() isDetail= false;

  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'maintenanceMaterialId', header: 'maintenance-component-id'},
    {field: 'stockNo', header: 'component-no'},
    {field: 'stock', header: 'component'},
    {field: 'batch', header: 'batch'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'materialCost', header: 'material-cost'},
    {field: 'finalCost', header: 'final-cost'}

  ];
  cols = [
    {field: 'maintenanceMaterialId', header: 'maintenance-component-id'},
    // {field: 'maintenanceOrder', header: 'maintenance-order'},
    {field: 'stockNo', header: 'component-no'},
    {field: 'stock', header: 'component'},
    {field: 'batch', header: 'batch'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
    {field: 'materialCost', header: 'material-cost'},
    {field: 'finalCost', header: 'final-cost'}
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
    stockId: null,
    maintenanceOrderId: null,
    maintenanceMaterialId: null,
    query: null,
    orderByProperty: 'maintenanceMaterialId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private productionOrderMaterialService: ProductionOrderMaterialService,
              private mStrategyTypeSvc: MaintenanceOrderComponentService) {
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.mStrategyTypeSvc.filterObservable(this.pageFilter))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        const cleanReservationData = this.tableData.filter(itm => itm.reservation != null);
        const reservationList = cleanReservationData.map(itm => itm.reservation);
        const cleanNotificationData = this.tableData.filter(itm => itm.stockTransferNotificationList != null);
        const notificationList = cleanNotificationData.map(itm => itm.stockTransferNotificationList);
        this.reservationAndNotificationList.next(
          {
            reservationList: reservationList,
            notificationList: notificationList
          });
        this.loaderService.hideLoader();
      },
      error => {
        this.tableData = [];
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );

    this.filter(this.pageFilter);
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();

    this.searchTerms.next(data);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;

    this.modal.active = true;

    // for excluding already selected materials in choosestock pane for new item selection
    const materials = this.tableData.map(itm => itm.stock);
    this.productionOrderMaterialService.componentMaterialChangedSubject.next(materials);
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
    this.search(this.pageFilter)
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  getIndex(index) {
    this.tableDetailIndex = index;
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      stockId: null,
      maintenanceOrderId: this.pageFilter.maintenanceOrderId,
      maintenanceMaterialId: null,
      query: null,
      orderByProperty: 'maintenanceMaterialId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  showDetailDialog(id, type:string){
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.mStrategyTypeSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
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
