import {AppStateService} from 'app/services/dto-services/app-state.service';
import {Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter} from '@angular/core';


import {StockTransferNotificationService} from 'app/services/dto-services/stock-transfer-notification/stock-transfer-notification.service';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {StockTransferReceiptService} from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import {ActivatedRoute} from '@angular/router';
import {PreviousRouteService} from 'app/services/shared/previous-page.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from 'environments/environment';
import {FilterStockTransferNotificationItemDto, StockTransferNotificationDetailDto} from 'app/dto/stock/stock-transfer-notification.model';
import {Subscription} from 'rxjs';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {EnumService} from 'app/services/dto-services/enum/enum.service';
import {ConvertUtil} from 'app/util/convert-util';
import {DialogTypeEnum} from 'app/services/shared/dialog-types.enum';
import {EmployeeService} from 'app/services/dto-services/employee/employee.service';
import { CommonTemplateTypeEnum, RequestPrintDto } from 'app/dto/print/print.model';
import { ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import { BookType } from 'xlsx/types';

@Component({
  selector: 'app-transfer-notification-list',
  templateUrl: './list-transfer-notification.component.html',
  styleUrls: ['./list-transfer-notification.component.scss']
})

export class ListStockTransferNotificationComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;

  @ViewChild('confirmButton') public confirmButton: ElementRef<HTMLButtonElement>;
  stockModal = {
    modal: null,
    id: null,
    data: null,
    transferReceipt: null
  };

  
  menuItems:MenuItem[] = [
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
  selecteMenuItems:MenuItem[] = [
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

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = {active: false};

  preSelectedPlant: any = {
    plantName: null,
    plantId: null
  };

  selectedTransferReceipts;

  activityTypeList: any;

  documentTypeList: any;

  cloneDocumentTypeList: any;

  goodMovementStatusList: any;

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

  pageFilter: FilterStockTransferNotificationItemDto = this._stockNotificationSvc.pageFilter;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  transfers = [];

  showMovementCancelButton = false;

  showMovementEditButton = false;

  showLoader = false;

  selectedColumns = [
    {field: 'referenceId', header: 'reference-id'},
    {field: 'postingDate', header: 'posting-date'},
    {field: 'goodMovementDocumentType', header: 'document-type'},
    {field: 'forklift', header: 'plate-no'},
    {field: 'dispatcher', header: 'dispatcher'},
    {field: 'wareHouseFromName', header: 'warehouse-from'},
    {field: 'wareHouseToName', header: 'warehouse-to'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'quantity', header: 'quantity'},
    //{field: 'baseUnit', header: 'base-unit'},
    //{field: 'batch', header: 'batch'},
    {field: 'jobOrderOperationId', header: 'job-order-operation'},
    {field: 'operationName', header: 'operation'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'prodOrderId', header: 'production-order-id'},
    {field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    {field: 'barcode', header: 'barcode'},
    {field: 'barcodeTo', header: 'barcode-to'},
    {field: 'dispatchingStatusEnum', header: 'dispatching-status'},
    {field: 'goodsMovementStatus', header: 'status'},
    {field: 'transferStartTime', header: 'transfer-start-time'},
    {field: 'transferFinishTime', header: 'transfer-finish-time'},
  ];

  cols = [
    {field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    {field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'goodsMovementActivityType', header: 'activity-type'},
    {field: 'goodMovementDocumentType', header: 'document-type'},
    {field: 'goodsMovementStatus', header: 'status'},
    {field: 'purchaseOrderId', header: 'purchase-order-id'},
    {field: 'prodOrderId', header: 'production-order-id'},
    {field: 'saleOrderId', header: 'sales-order-id'},
    {field: 'documentNo', header: 'document-no'},
    {field: 'documentDate', header: 'document-date'},
    {field: 'postingDate', header: 'posting-date'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'plantName', header: 'plant'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material'},
    {field: 'batch', header: 'batch'},
    {field: 'locationNo', header: 'location-no'},
    {field: 'isDefected', header: 'defect'},
    {field: 'wareHouseFromName', header: 'warehouse-from'},
    {field: 'wareHouseToName', header: 'warehouse-to'},
    {field: 'transferStartTime', header: 'transfer-start-time'},
    {field: 'transferFinishTime', header: 'transfer-finish-time'},
    {field: 'dispatcher', header: 'dispatcher'},
    {field: 'dispatchingStatusEnum', header: 'dispatching-status'},
    {field: 'forklift', header: 'forklift'},
    {field: 'quantity', header: 'quantity'},
    {field: 'baseUnit', header: 'base-unit'},
    {field: 'pallet', header: 'pallet-id'},
    {field: 'barcode', header: 'barcode'},
    {field: 'barcodeTo', header: 'barcode-to'}

  ];

  // for closing modal
  confirmationButtonClicked = false;
  @Output() closeEvent = new EventEmitter<any>();
  dispatchingStatusList: any;

  @Input('filterData') set sc(filterData) {
    if (filterData) {
      if (filterData.waitingNotificationTransferTo) {
        this.pageFilter.wareHouseFromName = filterData.warehouseName;
      } else {
        this.pageFilter.wareHouseFromName = null;
      }
      if (filterData.waitingNotificationTransferFrom) {
        this.pageFilter.wareHouseToName = filterData.warehouseName;
      } else {
        this.pageFilter.wareHouseToName = null;
      }

      this.pageFilter.materialNo = filterData.materialNo;
      this.pageFilter.batch = filterData.batch;
      this.pageFilter.goodsMovementStatus = 'REQUESTED';
      setTimeout(() => {
        this.search(this.pageFilter);
      }, 500);

    }
  }

  @Input('filteredData') set fData(filterData) {

    if (filterData && filterData.type === 'blocked') {
      let data = filterData.selectedRow;
      this.pageFilter.materialName = data.materialName;
      this.pageFilter.materialNo = data.materialNo;
      this.pageFilter.wareHouseToName = data.warehouseName;
      this.pageFilter.batch = data.batch;
      this.pageFilter.defected = true;
      this.pageFilter.goodsMovementStatus = 'COMPLETED';
    }
  }

  @Input() mobileDash = false;

  @Input('dispatcher') dispatcher = false;

  modal = {active: false};

  sub: Subscription[] = [];

  documentType: null;

  stockTransferNotificationDetail: any;

  @Input('documentType') set ds(type) {
    if (type) {
      this.documentType = type;
      this.pageFilter.goodMovementDocumentType = type;
      this.pageFilter.goodsMovementStatus = 'REQUESTED';
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 500);

    }
  }

  @Input('activityType') set dsactivityType(activityType) {
    if (activityType) {
      this.pageFilter.goodsMovementActivityType = activityType;
      this.pageFilter.goodsMovementStatus = 'REQUESTED';
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 500);
    }
  }

  @Input('goodsMovementStatus') set setgoodsMovementStatus(goodsMovementStatus) {
    if (goodsMovementStatus) {
      this.pageFilter.goodsMovementStatus = goodsMovementStatus;
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 500);
    }
  }

  @Input('dashboardStatus') set dStatus(data) {
    if (data) {
      if ((data.status == '' || data.status === null) && data.type === 'DOCUMENT_TYPE') {
        this.pageFilter.goodsMovementStatus = null;
        this.pageFilter.goodMovementDocumentType = null;
        this.pageFilter.goodsMovementActivityType = null;
      } else if (data.type === 'DOCUMENT_TYPE') {
        this.pageFilter.goodsMovementStatus = data.goodsMovementStatus;
        this.pageFilter.goodMovementDocumentType = data.status;
        this.pageFilter.goodsMovementActivityType = null;
      } else if (data.type === 'CONFIRMED_NOTIFICATIONS') {
        this.pageFilter.goodsMovementStatus = data.goodsMovementStatus;
        this.pageFilter.goodMovementDocumentType = data.status;
        this.pageFilter.goodsMovementActivityType = null;
      } else if (data.type === 'ACTIVITY_TYPE') {
        this.pageFilter.goodsMovementStatus = data.goodsMovementStatus;
        this.pageFilter.goodMovementDocumentType = null;
        this.pageFilter.goodsMovementActivityType = data.status;
      }
      setTimeout(() => {
        this.filter(this.pageFilter);
      }, 500);
    }
  }


  constructor(
    private _stockNotificationSvc: StockTransferNotificationService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _stockTransferReceiptSvc: StockTransferReceiptService,
    private utilities: UtilitiesService,
    private appStateSvc: AppStateService,
    private loaderService: LoaderService,
    private previouUrlSvr: PreviousRouteService,
    private route: ActivatedRoute,
    private _empSvc: EmployeeService,
    private _enumSvc: EnumService) {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('waitingNotificationTransferTo')) {
        this.pageFilter.wareHouseToName = params.get('warehouseName');
      }
      if (params.get('waitingNotificationTransferFrom')) {
        this.pageFilter.wareHouseFromName = params.get('warehouseName');
      }
      if (params.get('materialNo')) {
        this.pageFilter.materialNo = params.get('materialNo');
        this.pageFilter.goodsMovementStatus = 'REQUESTED';
      }
    });
    // const todayDate = new Date();
    // todayDate.setDate(todayDate.getDate() + 1);
    // this.pageFilter.endDate = todayDate;

  }

  ngOnInit() {
   this.pageFilter.goodMovementDocumentType = 'TRUCK_TRANSFER';
    this.goodMovementNotificationLists();

    this.sub.push(this._stockNotificationSvc.stockTransferList.subscribe(
      (result: any) => {
        if (result) {
          let transferNotifications = result['content'];
          console.log(transferNotifications);
          if (transferNotifications) {
            transferNotifications = transferNotifications.sort((a, b) => {
              var x = a.goodsMovementStatus;
              var y = b.goodsMovementStatus;
              if (x == 'REQUESTED' && y != 'REQUESTED') {
                return -1;
              }
              if (x == 'REQUESTED' && y == 'REQUESTED') {
                return b.stockTransferNotificationDetailId - a.stockTransferNotificationDetailId
              }
              return 0;
            });
          }
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.transfers = transferNotifications;
          this.loaderService.hideLoader();
          if ((!result['content'] || result['content'].length == 0) && this.confirmationButtonClicked) {
            this.confirmationButtonClicked = false;
            this.closeEvent.next('close');
          } else {
            this.confirmationButtonClicked = false;
          }
        } else {
          this.filter(this.pageFilter);
        }
        this._stockNotificationSvc.stockTransferPageOpenFirstTime = false;
      },
      error => {
        this.loaderService.hideLoader();
        this.transfers = [];
        this.utilities.showErrorToast(error);
      }
    ));
    
    
    this.sub.push(this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.preSelectedPlant.plantName = res.plantName;
        this.preSelectedPlant.plantId = res.plantId;
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + 1);
        this.pageFilter.endDate = todayDate;
        this.filter(this.pageFilter);
      }
      // if (!this._stockNotificationSvc.stockTransferPageOpenFirstTime) {
      //   this._empSvc.getProfileDetail().then((emp) => {
      //     // this.pageFilter.dispacher = emp['employeeId'];
      //     this.filter(this.pageFilter);
      //   })
        // this.filter(this.pageFilter);
      // }
    }));
  }

  ngOnDestroy() {
    this._stockNotificationSvc.stockTransferPageOpenFirstTime = true;
    this._stockNotificationSvc.pageFilter = this.pageFilter;
    this.sub.forEach(s => s.unsubscribe());
  }

  goodMovementNotificationLists() {

    this._enumSvc.getGoodsMovementNotificationStatus().then((result) => {
      this.goodMovementStatusList = result;
    }).catch(error => console.log(error));
    ;

    this._enumSvc.getGoodsMovementActivityTypeList().then(result => {
      this.activityTypeList = result;
    }).catch(error => console.log(error));
    this._enumSvc.getDispatchingStatusEnum().then(result => {
      this.dispatchingStatusList = result;
    }).catch(error => console.log(error));

    this._enumSvc.getGoodsMovementDocumentTypeList().then(result => {
      this.documentTypeList = result;
      this.cloneDocumentTypeList = result;
      this.changeActivityTypeList(this.pageFilter.goodsMovementActivityType);
    }).catch(error => console.log(error));

  }


  ClearDates() {
    this.pageFilter.startDate = null;
    this.pageFilter.endDate = null;
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data = null) {
    if (mod === 'DETAIL') {
      this.loaderService.showLoader();

      this._stockNotificationSvc.getStockTransferReceiptNotificationDetail(id).then((result: StockTransferNotificationDetailDto) => {
        console.log('@transfereNotifiactionDetail', result)
        this.loaderService.hideLoader();
        this.stockModal.id = id;
        this.stockModal.modal = mod;
        this.stockModal.data = data;
        this.stockModal.transferReceipt = result;
        this.modal.active = true;
        setTimeout(() => {
          this.confirmButton.nativeElement.focus();
        }, 1000);
      });
    } else {
      this.stockModal.id = id;
      this.stockModal.modal = mod;
      this.stockModal.data = data;
      this.stockModal.transferReceipt = null;
      this.modal.active = true;
    }
  }

  confirmTransferNotification(id: any, key = 'lisNotification') {
    const confirmTransferNotification = [];
    this.stockModal.transferReceipt.responseStockTransferNotificationDetailList.map(itm => {
      let quantity = itm.quantity;
      let documentNo = itm.documentNo;
      let locationNo = itm.locationNo;
      let barcode = itm.barcode;
      if (this.stockTransferNotificationDetail) {
        documentNo = this.stockTransferNotificationDetail.documentNo;
        const responseStockTransferNotificationDetailList = this.stockTransferNotificationDetail.responseStockTransferNotificationDetailList;
        if ((responseStockTransferNotificationDetailList)) {
          const notification = responseStockTransferNotificationDetailList
            .find(notific => itm.stockTransferNotificationDetailId === notific.stockTransferNotificationDetailId)
          if (notification) {
            quantity = parseInt(notification.quantity);
            barcode = notification.barcode;
            locationNo = notification.locationNo;
          }
        }
      }
      if (itm.goodsMovementStatus === 'REQUESTED') {
        confirmTransferNotification.push({
          height: itm.height,
          quantity: quantity,
          locationNo:locationNo,
          barcode:barcode,
          documentNo: documentNo,
          stockTransferNotificationDetailId: itm.stockTransferNotificationDetailId,
          width: itm.width,
        });
      }
    });

    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-confirm'),
      header: this._translateSvc.instant('accept-confirmation'),
      icon: 'fa fa-check',
      key: key,
      accept: () => {
        this.loaderService.showLoader();

        this._stockNotificationSvc.confirmNotificationList(confirmTransferNotification).then(() => {
          this.loaderService.hideLoader();
          this.confirmationButtonClicked = true;
          this.utilities.showSuccessToast('saved-success');
          if (this.myModal && this.myModal.isShown) {
            this.myModal.hide();
          }
          setTimeout(() => {
            this.search(this.pageFilter);
          }, 300);
        }).catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error);
        });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  setStockTransferRecieptSaveData(rowData) {
    const stockTransferReceipt = {
      stockTransferReceiptId: null,
      goodsMovementActivityType: rowData.goodsMovementActivityType,
      goodMovementDocumentType: rowData.goodMovementDocumentType,
      purchaseOrderId: rowData.purchaseOrderId,
      purchaseOrderDetailId: rowData.purchaseOrderDetailId, // not present
      prodOrderId: rowData.prodOrderId,
      jobOrderId: rowData.jobOrderId, // not present
      orderId: rowData.saleOrderId,
      orderDetailId: rowData.orderDetailId, // not present
      documentNo: rowData.documentNo,
      documentDate: rowData.documentDate,
      postingDate: rowData.postingDate,
      jobOrderOperationId : rowData.jobOrderOperationId,
      operationName : rowData.operationName,
      actId: rowData.actId,
      goodsMovementStatus: rowData.goodsMovementStatus,
      description: rowData.description,

      requestCreateStockTransferDetailList: rowData.responseStockTransferNotificationDetailList ?
        rowData.responseStockTransferNotificationDetailList.map(itm => {

          let quantity = itm.quantity;

          if ((this.stockTransferNotificationDetail)) {
            let responseStockTransferNotificationDetailList = this.stockTransferNotificationDetail.responseStockTransferNotificationDetailList;
            if ((responseStockTransferNotificationDetailList)) {
              const notification = responseStockTransferNotificationDetailList.find(notific => itm.stockTransferNotificationDetailId === notific.stockTransferNotificationDetailId)
              if (notification) {
                quantity = notification.quantity;
              }
            }
          }
          return {
            'baseUnit': itm.baseUnit,
            'batch': itm.batch,
            'batchFrom': itm.batchFrom,
            'defected': itm.defect,
            'goodsMovementStatus': itm.goodsMovementStatus,
            'itemNo': itm.itemNo,
            'jobOrderPosition': itm.jobOrderPosition,
            'palletRequest': itm.palletRequest,
            'plantId': itm.plantId,
            'quantity': quantity,
            'stockId': itm.materialId,
            'stockTransferDetailId': null,
            'stockTransferNotificationDetailId': itm.stockTransferNotificationDetailId,
            'stockTransferReceiptId': null,
            'wareHouseFromId': itm.wareHouseFromId,
            'wareHouseToId': itm.wareHouseToId
          }
        })
        : null
    };

    return stockTransferReceipt;
  }

  setStockTransferNotificationSaveData(rowData) {
    const stockTransferNotification = {
      description: rowData.description,
      documentDate: rowData.documentDate,
      documentNo: rowData.documentNo,
      goodMovementDocumentType: rowData.goodMovementDocumentType,
      goodsMovementActivityType: rowData.goodsMovementActivityType,
      goodsMovementStatus: rowData.goodsMovementStatus,
      groupCodeId: rowData.groupCodeId,
      orderId: rowData.saleOrderId,
      jobOrderOperationId : rowData.jobOrderOperationId,
      operationName : rowData.operationName,
      postingDate: rowData.postingDate,
      prodOrderId: rowData.prodOrderId,
      purchaseOrderId: rowData.purchaseOrderId,
      stockTransferReceiptNotificationId: rowData.stockTransferReceiptNotificationId,


      // stockTransferReceiptId: null,
      // purchaseOrderDetailId: rowData.purchaseOrderDetailId, // not present
      // jobOrderId: rowData.jobOrderId, // not present
      // orderDetailId: rowData.orderDetailId, // not present
      // actId: rowData.actId,

      requestCreateStockTransferNotificationDetailList: rowData.responseStockTransferNotificationDetailList ?
        rowData.responseStockTransferNotificationDetailList.map(itm => {

          let quantity = itm.quantity;

          if ((this.stockTransferNotificationDetail)) {
            let responseStockTransferNotificationDetailList = this.stockTransferNotificationDetail.responseStockTransferNotificationDetailList;
            if ((responseStockTransferNotificationDetailList)) {
              const notification = responseStockTransferNotificationDetailList.find(notific => itm.stockTransferNotificationDetailId === notific.stockTransferNotificationDetailId)
              if (notification) {
                quantity = notification.quantity;
              }
            }
          }
          return {
            baseUnit: itm.baseUnit,
            batch: itm.batch,
            batchFrom: itm.batchFrom,
            defected: itm.defect,
            goodsMovementStatus: itm.goodsMovementStatus,
            itemNo: itm.itemNo,
            jobOrderPosition: itm.jobOrderPosition,
            palletRequest: itm.palletRequest,
            plantId: itm.plantId,
            quantity: quantity,
            stockId: itm.materialId,
            stockTransferNotificationDetailId: itm.stockTransferNotificationDetailId,
            stockTransferReceipNotificationtId: itm.stockTransferReceiptNotificationId,
            toWorkstation: null,
            wareHouseFromId: itm.wareHouseFromId,
            wareHouseToId: itm.wareHouseToId
          }
        })
        : null
    };

    return stockTransferNotification;
  }

  onNotificationQuantityChanged(stockTransferNotificationDetail) {
    console.log('@onNotificationQuantityChanged', stockTransferNotificationDetail)
    this.stockTransferNotificationDetail = stockTransferNotificationDetail;
  }

  cancelTransferNotification(id: number, key = 'lisNotification') {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-trash',
      key: key,
      accept: () => {
        this._stockNotificationSvc.cancel(id).then(() => {
            this.utilities.showSuccessToast('cancel-success');
            if (this.myModal && this.myModal.isShown) {
              this.myModal.hide();
            }
            this.search(this.pageFilter);
          }
        ).catch(err => {
          this.utilities.showErrorToast(err);
        })
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    if(this.pageFilter.plantId)
      this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();
    data['orderId'] = data['saleOrderId'];

    if (data['orderByProperty'] === 'saleOrderId') {
      data['orderByProperty'] = 'orderId';
    }

    this.changeActivityTypeList(data['goodsMovementActivityType']);

    const temp = Object.assign({}, data);

    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.endDate) {
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);

    }

    this._stockNotificationSvc.searchstockTransferTerms.next(temp);
  }

  changeActivityTypeList(activityType) {
    if (this.cloneDocumentTypeList) {
      if (activityType == 'GOODS_RECEIPT') {
        this.documentTypeList = this.cloneDocumentTypeList.filter(item => item != 'SALES_ORDER' && item != 'ON_SITE' && item != 'WORKSTATION');
      } else if (activityType == 'GOODS_ISSUE') {
        this.documentTypeList = this.cloneDocumentTypeList.filter(item => item != 'PURCHASE_ORDER' && item != 'PRODUCTION_ORDER' && item != 'ON_SITE' && item != 'WORKSTATION');
      } else if (activityType == 'TRANSFER_POSTING') {
        this.documentTypeList = this.cloneDocumentTypeList.filter(item => item != 'PURCHASE_ORDER' && item != 'PRODUCTION_ORDER' && item != 'SALES_ORDER');
      }
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

  resetFilter() {
    this.pageFilter = {
      actId: null,
      baseUnit: null,
      batch: null,
      defected: null,
      description: null,
      dispatchingStatusEnum: null,
      documentDate: null,
      dispacher: null,
      dispacherName: null,
      documentNo: null,
      employeeId: null,
      employeeName: null,
      endDate: null,
      goodMovementDocumentType: null,
      goodsMovementActivityType: null,
      goodsMovementStatus: null,
      groupCodeId: null,
      itemNo: null,
      materialId: null,
      materialName: null,
      materialNo: null,
      orderByDirection: null,
      orderByProperty: null,
      orderDetailId: null,
      orderId: null,
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      plantId: this.pageFilter.plantId,
      plantName: null,
      postingDate: null,
      prodOrderId: null,
      purchaseOrderId: null,
      quantity: null,
      query: null,
      startDate: null,
      stockId: null,
      stockTransferDetailId: null,
      stockTransferReceipNotificationtId: null,
      wareHouseFromId: null,
      wareHouseFromName: null,
      wareHouseToId: null,
      wareHouseToName: null
    };
    this.filter(this.pageFilter);
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showEmployeeDetail(emplId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, emplId);
  }

  showPurchaseOrderDetailDialog(purchaseOrderId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, purchaseOrderId);
  }

  processTask(rowData, index) {

    let reqDto = {
      'action': 'PROCESSING',
      'dispatcherId': rowData.dispatcher?.employeeId,
      'forkliftId': rowData.forklift?.forkliftId,
      'transferNotificationDetailId': rowData.stockTransferNotificationDetailId
    }
    this.loaderService.showLoader();
    this._stockNotificationSvc.dispatchingPlan(reqDto).then((res: any) => {
      this.transfers[index] = res;
      this.utilities.showSuccessToast('dispatching-plan-success')
      this.filter(this.pageFilter)
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err)
    })

  }

  showPurchaseOrderDialog(rowData: any) {
    console.log('@rowData', rowData)
    if (rowData.goodsMovementActivityType === 'GOODS_RECEIPT' && rowData.goodMovementDocumentType == 'PURCHASE_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, rowData.itemNo);
    } else if (rowData.goodsMovementActivityType === 'GOODS_RECEIPT' && rowData.goodMovementDocumentType == 'PRODUCTION_ORDER') {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, rowData.itemNo);
    } else if (rowData.goodsMovementActivityType === 'TRANSFER_POSTING' && rowData.goodMovementDocumentType == 'WORKSTATION') {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, rowData.itemNo);
    } else {
      this.modalShow(rowData.stockTransferReceiptNotificationId, 'DETAIL', rowData)
    }
  }

  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 4;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.GOODS_MOVEMENT_NOTIFICATION;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.stockModal.id;
    this.printComponent.active = true;
  }

  showProductionOrderDetailDialog(prodOrderId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
  }

  showJobOrderOperationDetail(jobOrderOperationId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, jobOrderOperationId);
  }

  showOperationDetail(operationId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, operationId);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showPalletDetail(palletId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PALLETRECORD, palletId);
  }

  showMaterialDetailDialog(materialId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showWareHouseFromDialog(warehouseId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedTransferReceipts.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'pallet') {
            obj[this._translateSvc.instant(col.header)] = itm.pallet ? itm.pallet.palletId : '';
          } else if(col.field === 'forklift') {
            obj[this._translateSvc.instant(col.header)] = itm.forklift ? itm.forklift.forkliftName : '';
          } else if(col.field === 'transferStartTime') {
            obj[this._translateSvc.instant(col.header)] = itm.transferStartTime ? new Date(itm.transferStartTime).toLocaleString() : '';
          }else if(col.field === 'transferFinishTime') {
            obj[this._translateSvc.instant(col.header)] = itm.transferFinishTime ? new Date(itm.transferFinishTime).toLocaleString() : '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'transfer-operations');
    } else {
      this.loaderService.showLoader();
      this._stockNotificationSvc.filterStockTransferReceiptNotificationObs({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .subscribe(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'pallet') {
              obj[this._translateSvc.instant(col.header)] = itm.pallet ? itm.pallet.palletId : '';
            } else if(col.field === 'forklift') {
              obj[this._translateSvc.instant(col.header)] = itm.forklift ? itm.forklift.forkliftName : '';
            } else if(col.field === 'transferStartTime') {
              obj[this._translateSvc.instant(col.header)] = itm.transferStartTime ? new Date(itm.transferStartTime).toLocaleString() : '';
            }else if(col.field === 'transferFinishTime') {
              obj[this._translateSvc.instant(col.header)] = itm.transferFinishTime ? new Date(itm.transferFinishTime).toLocaleString() : '';
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateSvc.exportAsFile(mappedDAta, type, 'transfer-operations');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }

}

