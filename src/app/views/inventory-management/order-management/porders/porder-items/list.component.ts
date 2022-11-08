import { UsersService } from 'app/services/users/users.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng';

import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { CommonTemplateTypeEnum, RequestPrintDto } from 'app/dto/print/print.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { PreviousRouteService } from 'app/services/shared/previous-page.service';
import { BookType } from 'xlsx/types';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'porder-items-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListPorderDetailComponent implements OnInit, OnDestroy {
  // @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  preSelectedPlant: any;

  modal2 = { active: false };

  porderModal = {
    modal: null,
    parentId: null,
    id: null, type: null, data: null,
  };

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
  showLoader = false;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  porders = [];

  listPorderStatus;

  purchaseOrderType;

  selectedCauses = [];

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = { active: false };

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
  // change require
  pageFilter = this._porderSvc.purchaseOrderItemPageFilter;
  selectedColumns = [
    { field: 'purchaseOrderDetailId', header: 'order-detail-id' },
    { field: 'porderId', header: 'order-id' },
    { field: 'purchaseOrderDetailCode', header: 'order-detail-no' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material' },
    { field: 'supplierName', header: 'vendor' },
    // { field: 'batch', header: 'batch' },
    { field: 'warehouseName', header: 'warehouse' },
    //{ field: 'height', header: 'height' },
    //{ field: 'width', header: 'width' },
    { field: 'quantity', header: 'quantity' },
    { field: 'baseUnit', header: 'base-unit' },
    //{ field: 'orderUnit', header: 'order-unit' },
    //{ field: 'totalNetPrice', header: 'total-net-price' },
    //{ field: 'totalEffectivePrice', header: 'total-effective-price' },
    //{ field: 'totalDeliveryCost', header: 'total-delivery-cost' },
    // { field: 'totalIncomeQuantity', header: 'total-income-quantity' },
    // { field: 'totalIncomeQuantity', header: 'income-quantity' },
    { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
    { field: 'purchasePrice', header: 'purchase-price' },
    { field: 'operationName', header: 'operation-name' },
    { field: 'purchaseOrderStatus', header: 'purchase-order-detail-status' },
    { field: 'purchaseOrderType', header: 'purchase-order-type' },
    { field: 'porderDate', header: 'order-date' },
    { field: 'priority', header: 'priority' },
    { field: 'reservedQuantity', header: 'reserved-quantity' },
    { field: 'outsource', header: 'outsource' },
    { field: 'deliveryDate', header: 'end-delivery-date' }

  ];

  cols = [
    { field: 'porderId', header: 'order-id' },
    { field: 'porderNo', header: 'order-no' },
    { field: 'purchaseOrderDetailCode', header: 'order-detail-no' },
    { field: 'purchaseOrderDetailId', header: 'order-detail-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'plantName', header: 'plant' },
    { field: 'stockName', header: 'material' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'supplierName', header: 'vendor' },
    //{ field: 'requestedByName', header: 'requested-by' },
    { field: 'batch', header: 'batch' },
    { field: 'height', header: 'height' },
    { field: 'width', header: 'width' },
    { field: 'dimensionUnit', header: 'dimension-unit' },
    { field: 'quantity', header: 'quantity' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'orderUnit', header: 'order-unit' },
    { field: 'fixedPrice', header: 'fixed-price' },
    { field: 'requestedByName', header: 'requested-by' },
    { field: 'porderDate', header: 'order-date' },
    { field: 'outsource', header: 'outsource' },
    { field: 'priority', header: 'priority' },
    { field: 'purchasePrice', header: 'purchase-price' },
    { field: 'totalIncomeQuantity', header: 'total-income-quantity' },
    { field: 'deliveryStartDate', header: 'start-delivery-date' },
    { field: 'deliveryDate', header: 'end-delivery-date' },
    { field: 'purchaseOrderType', header: 'purchase-order-type' },
    { field: 'description', header: 'description' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
    { field: 'purchaseOrderStatus', header: 'purchase-order-detail-status' },
  ];

  sub: Subscription[] = [];

  commonPriorities = [];

  @Input('filterData') set fd(filter) {
    // console.log('@filterData', filter)
    if (filter) {
      // this.selectedColumns = [
      //   { field: 'stockNo', header: 'material-no' },
      //   { field: 'stockName', header: 'material' },
      //   { field: 'warehouseName', header: 'storage-location' },
      // ];
      this.pageFilter.warehouseId = filter.warehouseId;
      this.pageFilter.warehouseName = filter.warehouseName;
      this.pageFilter.stockId = filter.materialId;
      this.pageFilter.stockNo = filter.materialNo;
      this.pageFilter.stockName = filter.materialName;
      this.pageFilter.plantId = filter.plantId;
      this.pageFilter.purchaseOrderStatus = 'CONFIRMED';
      this.loaderService.showLoader();
      this.filter(this.pageFilter);
      // this.pageFilter.batch = filter.batch;
    }
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if (value && field === 'porderNo') {
      value = String(value).toUpperCase();
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _enumPorderStatus: EnumPOrderStatusService,
    private _saleSvc: SalesOrderService,
    private _actSvc: ActService,
    private _translateSvc: TranslateService,
    private _porderSvc: PorderService,
    private _useSvc: UsersService,
    private previouUrlSvr: PreviousRouteService,
    private appStateSvc: AppStateService,
    private loaderService: LoaderService,
    public activatedRoute: ActivatedRoute,
    private utilities: UtilitiesService,
    private datePipe: DatePipe,
    private _enumSvc: EnumService) {
    this.sub.push(this.appStateSvc.plantAnnounced$.subscribe(res => {

      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.preSelectedPlant = res;
      }
      if (!this._porderSvc.purchaseOrderItemPageOpenFirstTime) {
        this.resetFilter();
      }

    }));
  }
  modalShow(id, mod: string, rowData) {
    this.modal2.active = true;
    this.porderModal.id = id;
    this.porderModal.parentId = rowData?.porderId;
    this.porderModal.modal = mod;
    this.porderModal.data = rowData;
    // this.myModal.show();
  }

  ngOnInit() {
    // order-typ
    this._saleSvc.getPurchaseOrderTypes().then(result => {
      if (result && result.length > 0) {
        this.purchaseOrderType = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    this._enumPorderStatus.getEnumList().then(result => {
      if (result && result.length > 0) {
        this.listPorderStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => {
      if (result && result.length > 0) {
        this.commonPriorities = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));

    this.sub.push(this._porderSvc.purchaseOrderItemList.subscribe(result => {
      if (result) {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.porders = result['content'];
        this.loaderService.hideLoader();
      } else {
        this.filter(this.pageFilter);
      }
      this._porderSvc.purchaseOrderItemPageOpenFirstTime = false;
    }));
    this.sub.push(this.activatedRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.pageFilter.plantName = params['plantName'];
        this.pageFilter.stockName = params['materialName'];
        this.pageFilter.warehouseName = params['warehouseName'];
        this.filter(this.pageFilter);
      }
    }));

    if (!((this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/base')
      // (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/quotations') ||
      // (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/quotations/list')
    )) {
      // this.resetFilter();
      this.filter(this.pageFilter);
      this._porderSvc.purchaseOrderItemPageOpenFirstTime = false;
      this._porderSvc.purchaseOrderPageOpenFirstTime = false;
    }



  }

  ngOnDestroy() {
    this._porderSvc.purchaseOrderItemPageOpenFirstTime = true;
    this._porderSvc.purchaseOrderItemPageFilter = this.pageFilter;
    this.sub.forEach(s => s.unsubscribe());
  }

  get isCombineButtonEnable() {
    if (!this.selectedCauses || this.selectedCauses.length <= 1) {
      return false;
    } else {
      const notRequestedItems = this.selectedCauses.filter(itm => itm.purchaseOrderStatus !== 'REQUESTED');
      if (notRequestedItems && notRequestedItems.length > 0) {
        return false;
      }
      const combinedItems = this.selectedCauses.filter(itm => itm.purchaseOrderType === 'COMBINED_PURCHASE_ORDER');
      if (combinedItems && combinedItems.length > 0) {
        return false;
      }

    }
    const vendorName = this.selectedCauses[0].supplierName;
    const notSameName = this.selectedCauses.filter(itm => itm.supplierName !== vendorName);
    if (notSameName && notSameName.length > 0) {
      return false;
    }
    // console.log(this.selectedCauses);
    return true;
  }
  PreselectedPlant() {
    const plant = this._useSvc.getPlant();
    this.preSelectedPlant = plant;
    console.log('@use this plant in the application', JSON.parse(plant));
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(this.pageFilter);
  }

  search(data) {

    this.loaderService.showLoader();

    const temp = Object.assign({}, data);

    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.endDate) {
      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
    }
    if (temp.porderDate) {
      temp.porderDate = ConvertUtil.date2EndOfDay(temp.porderDate);
      temp.porderDate = ConvertUtil.localDateShiftAsUTC(temp.porderDate);
    }


    if (temp.purchaseOrderStatusList && temp.purchaseOrderStatusList.length > 0) {
      temp.purchaseOrderStatusList = temp.purchaseOrderStatusList.map(x => x.name);
    }

    if (temp.purchaseOrderTypeList && temp.purchaseOrderTypeList.length > 0) {
      temp.purchaseOrderTypeList = temp.purchaseOrderTypeList.map(x => x.name);
    }

    if (temp.priorityList && temp.priorityList.length > 0) {
      temp.priorityList = temp.priorityList.map(x => x.name);
    }

    this._porderSvc.searchPurchaseOrderItemTerms.next(temp);
  }


  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
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
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      query: null,
      startDate: null,
      endDate: null,
      orderByProperty: 'porderId',
      orderByDirection: 'desc',
      baseUnit: null,
      batch: null,
      plantId: this.pageFilter.plantId,
      porderDate: null,
      purchaseOrderStatus: null,
      purchaseOrderType: null,
      orderUnit: null,
      quantity: null,
      stockId: null,
      totalIncomeQuantity: 0,
      wareHouseId: null,
      plantName: this.pageFilter.plantName,
      stockName: null,
      stockNo: null,
      warehouseName: null,
      priority: null
    }
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._porderSvc.deletePOrderItem(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if (selected) {
      const mappedDAta = this.selectedCauses.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'orderDate') {
            obj[this._translateSvc.instant(col.header)] = itm.orderDate ? new Date(itm.orderDate).toLocaleString() : '';
          } else if (col.field === 'deliveryDate') {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? this.datePipe.transform(new Date(itm.deliveryDate), 'dd/MM/yyyy HH:mm') : '';

          } else if (col.field === 'deliveryStartDate') {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryStartDate ? this.datePipe.transform(new Date(itm.deliveryStartDate), 'dd/MM/yyyy HH:mm') : '';

          } else if (col.field === 'porderDate') {
            obj[this._translateSvc.instant(col.header)] = itm.porderDate ? this.datePipe.transform(new Date(itm.porderDate), 'dd/MM/yyyy HH:mm') : '';

          } else if (col.field === 'purchasePrice') {
            obj[this._translateSvc.instant(col.header)] = itm.purchaseOrderItemCosting?.effectivePrice;

          } else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'purchaseordersItems');
    } else {
      this.loaderService.showLoader();
      this._porderSvc.filterDetItems({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field === 'orderDate') {
                obj[this._translateSvc.instant(col.header)] = itm.orderDate ? new Date(itm.orderDate).toLocaleString() : '';
              } else if (col.field === 'deliveryDate') {
                obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? this.datePipe.transform(new Date(itm.deliveryDate), 'dd/MM/yyyy HH:mm') : '';
              } else if (col.field === 'deliveryStartDate') {
                obj[this._translateSvc.instant(col.header)] = itm.deliveryStartDate ? this.datePipe.transform(new Date(itm.deliveryStartDate), 'dd/MM/yyyy HH:mm') : '';

              } else if (col.field === 'porderDate') {
                obj[this._translateSvc.instant(col.header)] = itm.porderDate ? this.datePipe.transform(new Date(itm.porderDate), 'dd/MM/yyyy HH:mm') : '';

              } else if (col.field === 'purchasePrice') {
                obj[this._translateSvc.instant(col.header)] = itm.purchaseOrderItemCosting?.effectivePrice;

              } else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateSvc.exportAsFile(mappedDAta, type, 'purchaseOrdersItems');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }

  }

  sendMail() {
    if (this.porderModal.data && this.porderModal.data.account) {
      this.loaderService.showLoader();
      this._actSvc.getDetail(this.porderModal.data.account.actId).then(result => {
        // this._mediaSvc.listMedia(this.porderModal.data.porderId, TableTypeEnum.PURCHASE_ORDER)
        // .then((res: any) => {
        //   if(res) {
        //     res.forEach((image: any) => {
        //       let link = document.createElement('a');
        //       link.setAttribute('type', 'hidden');
        //       link.setAttribute('href', image.path);
        //       link.setAttribute('download', image.fileName);
        //       document.body.appendChild(link);
        //       link.click();
        //       link.remove();
        //     });
        //   }
        // });
        this.loaderService.hideLoader();
        const mail = result['email'];
        const referenceId = this.porderModal.data.referenceId || '';
        window.open(`mailto:${mail}?subject=${referenceId}&body=`);
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
    }

  }

  sendMail2() {
    const data = {
      referenceId: this.porderModal.data.referenceId,
      actId: this.porderModal.data.supplierId,
      tableType: TableTypeEnum.PURCHASE_ORDER,
      templateTypeCode: CommonTemplateTypeEnum.PURCHASE_ORDER,
      itemId: this.porderModal.id,
      subject: this.porderModal.data.porderNo,
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
  }


  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 1;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.PURCHASE_ORDER;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.porderModal.parentId;
    this.printComponent.active = true;
  }


  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }
  showSupplierDetailDialog(supplierId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, supplierId);
  }

  showMaterialDetailDialog(stockId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showWarehouseDetailDialog(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }
  showPOrderDetailDialog(porderID) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, porderID);
  }

  fixRoundedDigit(value) {

    if (!(Math.ceil(parseFloat(value)) === value)) {
      return value.toFixed(2);
    }
    return value;
  }
  overviewFilterApply() {
    this.pageFilter.startDate = new Date(new Date().getFullYear(), 0, 1);
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - 7);
    this.pageFilter.endDate = endDate;
    this.pageFilter.purchaseOrderStatus = "CONFIRMED";
    this.pageFilter.outsource = false;
    this.search(this.pageFilter);

  }
}

