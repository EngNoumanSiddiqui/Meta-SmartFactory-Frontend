import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ReservationService } from 'app/services/dto-services/reservation/reservation.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { BookType } from 'xlsx/types';
@Component({
  selector: 'app-list-reservation',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListReservationComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;


  menuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportCSV(false, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportCSV(false, 'xlsx');
      }
    }
  ];
  selecteMenuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportCSV(true, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportCSV(true, 'xlsx');
      }
    }
  ];

  reservationModal = {
    active: false,
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

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    reservationId: null,
    itemNo: null,
    type: null,
    finalIssue: null,
    materialNo: null,
    isActive: null,
    materialId: null,
    materialName: null,
    plantId: null,
    plantName: null,
    warehouseId: null,
    warehouseName: null,
    batch: null,
    requirementDate: null,
    requirementQuantity: null,
    withdrawnQuantity: null,
    baseUnit: null,
    enteredUnitQuantity: null,
    enteredUnitMeasure: null,
    prodOrderId: null,
    orderDetailstatus: null,
    purcahseOrderDetailstatus: null,
    jobOrderStatus: null,
    prodOrderStatus: null,
    saleOrderId: null,
    equipmentStatus: null,
    orderDetailId: null,
    createDate: null,
    movementType: null,
    query: null,
    orderByProperty: 'reservationId',
    orderByDirection: 'desc',
    latestReservationStatus: null,
    latestReservationStatusList: [],
    movementTypeList: [],
    orderDetailStatusList: [],
    purchaseOrderDetailStatusList: [],
    jobOrderStatusList: [],
    prodOrderStatusList: []
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    // { field: 'status', header: 'status' },
    { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'warehouseFromName', header: 'warehouse-from' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'locationNo', header: 'location-no' },
    { field: 'barcode', header: 'barcode' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'waitingForJobOrderOperationId', header: 'waiting-for-job-order-operation-id' },
    { field: 'waitingForJobQuantity', header: 'waiting-for-job-quantity' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestReservationStatus', header: 'stock-reservation-status' },
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },

    { field: 'movementType', header: 'movement-type' }
  ];

  cols = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    { field: 'status', header: 'status' },
    { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'warehouseFromName', header: 'warehouse-from' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementDate', header: 'requirement-date' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'waitingForJobOrderOperationId', header: 'waiting-for-job-order-operation-id' },
    { field: 'waitingForJobQuantity', header: 'waiting-for-job-quantity' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestReservationStatus', header: 'stock-reservation-status' },
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },
    { field: 'withdrawnQuantity', header: 'quantity-withdrawn' },
    { field: 'enteredUnitQuantity', header: 'quantity-in-entered-unit' },
    { field: 'enteredUnitMeasure', header: 'entered-unit-of-measure' },
    { field: 'prodOrderId', header: 'production-order' },
    { field: 'saleOrderId', header: 'sales-order' },
    { field: 'orderDetailId', header: 'sales-order-item' },
    { field: 'movementType', header: 'movement-type' },
  ];


  selectedEquipments = [];

  equipments = [];

  listStatus;

  reservationsStatusList: any;

  showLoader = false;

  private sub: Subscription;

  subplant: Subscription;

  movementTypeList;

  private searchTerms = new Subject<any>();
  listPorderStatus: any;
  listProdOrderStatus: any;
  jobOrderStatusList: any;
  listOrderDetailStatus: any;
  filterButtonClicked: boolean = false;;

  @Input('filterData') set rFilter(filter) {
    if (filter) {
      // this.pageFilter.enteredUnitQuantity = filter.reservation;
      // this.pageFilter.materialId = filter.materialId;
      // this.pageFilter.materialName = filter.materialName;
      this.pageFilter.materialNo = filter.materialNo;
      this.pageFilter.warehouseId = filter.warehouseId;
      this.pageFilter.warehouseName = filter.warehouseName;
      this.pageFilter.batch = filter.batch;
      this.equipments = [];
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 500);

      // this.selectedColumns = [
      //   { field: 'materialNo', header: 'material-no' },
      //   { field: 'materialName', header: 'material' },
      //   { field: 'warehouseName', header: 'warehouse' },
      // ];
    }
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.reservationModal.id = id;
    this.reservationModal.modal = mod;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
    private _enumSvc: EnumService,
    private _enumPorderStatus: EnumPOrderStatusService,
    private _enumSaleOrderStatus: EnumOrderStatusService,
    private _jobOrderStatusSvc: EnumJobOrderStatusService,
    private _translateSvc: TranslateService,
    private _reservationSvc: ReservationService,
    private utilities: UtilitiesService,
    private appStateSvc: AppStateService,
    private loaderService: LoaderService, public activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {

    this._enumSvc.getMovementTypeList().then((r: any) => {
      if (r && r.length > 0) {
        this.movementTypeList = r.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    });

    this._enumSvc.getLatestStockReservationStatusEnums().then((result) => {
      if (result && result.length > 0) {
        this.reservationsStatusList = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }

    })
    this._enumSvc.getEquipmentStatusList().then(result => this.listStatus = result).catch(error => console.log(error));
    this._enumPorderStatus.getEnumList().then(result => {
      if (result && result.length > 0) {
        this.listPorderStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    this._enumPorderStatus.getProdOrderStatusEnum().then(result => {
      if (result && result.length > 0) {
        this.listProdOrderStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    this._jobOrderStatusSvc.getJobOrderEnumList().then((result: any) => {
      if (result && result.length > 0) {
        this.jobOrderStatusList = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    this._enumSaleOrderStatus.getOrderDetailEnumList().then(result => {
      if (result && result.length > 0) {
        this.listOrderDetailStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._reservationSvc.filterObservable(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.equipments = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.equipments = [];
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        }
      );
    this.sub = this.activatedRoute
      .queryParams
      .subscribe(params => {
        if (params['plantName'] || params['materialName']) {
          this.pageFilter.plantName = params['plantName'];
          this.pageFilter.materialName = params['materialName'];
          this.pageFilter.warehouseName = params['warehouseName'];

          this.filter(this.pageFilter);
        }
      });


    this.subplant = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        // this.resetFilter();
        // this.filter(this.pageFilter);
      } else {
        this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    });

  }

  filterWaitingMaterial() {
    this.filterButtonClicked = true;
    this.loaderService.showLoader();
    this._reservationSvc.filterReservationWaitingMaterial(this.pageFilter).then(result => {
      this.pagination.currentPage = result['currentPage'];
      this.pagination.totalElements = result['totalElements'];
      this.pagination.totalPages = result['totalPages'];
      this.equipments = result['content'];
      this.loaderService.hideLoader();
    }).catch(error => {
      this.equipments = [];
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
  }

  ngOnDestroy() {
    this.subplant.unsubscribe();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    const temp = Object.assign({}, data);

    if (temp.movementTypeList && temp.movementTypeList.length > 0) {
      temp.movementTypeList = temp.movementTypeList.map(x => x.name);
    }
    if (temp.latestReservationStatusList && temp.latestReservationStatusList.length > 0) {
      temp.latestReservationStatusList = temp.latestReservationStatusList.map(x => x.name);
    }
    if (temp.orderDetailStatusList && temp.orderDetailStatusList.length > 0) {
      temp.orderDetailStatusList = temp.orderDetailStatusList.map(x => x.name);
    }
    if (temp.purchaseOrderDetailStatusList && temp.purchaseOrderDetailStatusList.length > 0) {
      temp.purchaseOrderDetailStatusList = temp.purchaseOrderDetailStatusList.map(x => x.name);
    }
    if (temp.jobOrderStatusList && temp.jobOrderStatusList.length > 0) {
      temp.jobOrderStatusList = temp.jobOrderStatusList.map(x => x.name);
    }
    if (temp.prodOrderStatusList && temp.prodOrderStatusList.length > 0) {
      temp.prodOrderStatusList = temp.prodOrderStatusList.map(x => x.name);
    }
    if (this.filterButtonClicked) {
      this.filterWaitingMaterial();
    } else {
      this.loaderService.showLoader();
      this.searchTerms.next(temp);
    }

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

    this.search(this.pageFilter);
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

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      reservationId: null,
      itemNo: null,
      equipmentStatus: null,
      materialNo: null,
      type: null,
      finalIssue: null,
      isActive: null,
      materialId: null,
      materialName: '',
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
      warehouseId: null,
      orderDetailstatus: null,
      purcahseOrderDetailstatus: null,
      jobOrderStatus: null,
      prodOrderStatus: null,
      warehouseName: '',
      batch: null,
      requirementDate: null,
      requirementQuantity: null,
      withdrawnQuantity: null,
      baseUnit: null,
      enteredUnitQuantity: null,
      enteredUnitMeasure: null,
      prodOrderId: null,
      saleOrderId: null,
      orderDetailId: null,
      createDate: null,
      movementType: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      latestReservationStatus: null,
      latestReservationStatusList: [],
      movementTypeList: [],
      orderDetailStatusList: [],
      purchaseOrderDetailStatusList: [],
      jobOrderStatusList: [],
      prodOrderStatusList: []
    };
    this.filterButtonClicked = false;
    this.filter(this.pageFilter);
  }


  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._reservationSvc.cancel(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showMaterialDetail(material) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, material);
  }

  showPlantDetail(plant) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plant);
  }
  showJobOperationDetail(jobOperation) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, jobOperation);
  }

  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showWarehouseDetail(wareHouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, wareHouseId);
  }

  showPurchaseOrderDetail(purchaseOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, +purchaseOrderId);
  }

  showPurchaseOrderDetailItem(purchaseOrderItemId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, +purchaseOrderItemId);
  }
  showSalesOrderDetailItem(purchaseOrderItemId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, +purchaseOrderItemId);
  }

  showProdOrderDetail(prodOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, +prodOrderId);
  }

  fixRoundedDigit(value) {

    if (!(Math.ceil(parseFloat(value)) === value)) {
      return value.toFixed(2);
    }
    return value;
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if (selected) {
      const mappedDAta = this.selectedEquipments.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
          } else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'reservations');
    } else {
      this.loaderService.showLoader();
      this._reservationSvc.filterObservable({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .subscribe(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field === 'createDate') {
                obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
              } else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateSvc.exportAsFile(mappedDAta, type, 'reservations');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }
}
