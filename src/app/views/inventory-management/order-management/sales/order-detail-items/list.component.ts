import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ConfirmationService, MenuItem } from 'primeng';
import { ResponseOrderFilterListDto } from 'app/dto/sale-order/sale-order.model';
import { Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { CommonTemplateTypeEnum, RequestPrintDto } from 'app/dto/print/print.model';
import { BookType } from 'xlsx/types';
import { TableTypeEnum } from 'app/dto/table-type-enum';

@Component({
  selector: 'sale-order-items',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService]
})
export class ListSalesItemsComponent implements OnInit, OnDestroy {

  listOrderStatus;

  listOrderDetailStatus;

  selectedSales;
  jobOrderList = null;
  prodOrder = null;

  printComponent = { active: false };
  preSelectedPlant: any = {
    plantName: null,
    plantId: null
  };

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 1000,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: 1000,
    tag: ''
  };

  salesModal = {
    modal: null,
    data: null,
    mainData: null,
    id: null
  };
  requestPrintDto: RequestPrintDto = new RequestPrintDto();

  pageFilter = this._orderSvc.salesOrderItemPageFilter;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  saleOrders = [];

  selectedColumns = [
    { field: 'orderDetailId', header: 'order-detail-id' },
    { field: 'orderId', header: 'order-id' },
    { field: 'orderNo', header: 'order-no' },
    // { field: 'referenceId', header: 'order-confirmation' },
    { field: 'itemReferenceId', header: 'reference-id' },
    // {field: 'actTypeName', header: 'account-type'},
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material' },
    { field: 'actName', header: 'customer-name' },
    // { field: 'height', header: 'height' },
    // { field: 'width', header: 'width' },
    { field: 'quantity', header: 'quantity' },
    //{ field: 'baseUnit', header: 'base-unit' },
    { field: 'costCenterName', header: 'cost-center' },
    { field: 'quotationNo', header: 'quotation-no' },
    { field: 'warehouseName', header: 'warehouse' },
    // { field: 'batch', header: 'batch' },
    { field: 'customerOrderNo', header: 'customer-order-no' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'salePrice', header: 'sales-price' },
    { field: 'currency', header: 'currency' },
    //{ field: 'discount', header: 'discount' },
    { field: 'orderDetailStatus', header: 'order-detail-status' },
    { field: 'priority', header: 'priority' },
  ];

  cols = [
    { field: 'orderDetailId', header: 'order-detail-id' },
    { field: 'orderId', header: 'order-id' },
    { field: 'orderNo', header: 'order-no' },
    // { field: 'referenceId', header: 'order-confirmation' },
    { field: 'customerOrderNo', header: 'customer-order-no' },
    { field: 'quotationId', header: 'quotation-id' },
    { field: 'quotationNo', header: 'quotation-no' },
    { field: 'itemReferenceId', header: 'reference-id' },
    { field: 'actTypeName', header: 'account-type' },
    { field: 'documentNo', header: 'document-no' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material' },
    { field: 'stockName2', header: 'stock-name-2' },
    { field: 'stockName3', header: 'stock-name-3' },
    { field: 'plantName', header: 'plant' },
    { field: 'batch', header: 'batch' },
    { field: 'orderType', header: 'order-type' },
    { field: 'actName', header: 'customer-name' },
    { field: 'height', header: 'height' },
    { field: 'width', header: 'width' },
    { field: 'dimensionUnit', header: 'dimension-unit' },
    { field: 'directProduction', header: 'direct-production' },
    { field: 'description', header: 'description' },
    { field: 'orderDate', header: 'order-date' },
    { field: 'quantity', header: 'quantity' },
    { field: 'createDate', header: 'create-date' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'shipmentDate', header: 'shipment-date' },
    { field: 'deliveryCost', header: 'delivery-cost' },
    { field: 'netPrice', header: 'net-price' },
    { field: 'salePrice', header: 'sales-price' },
    { field: 'costPrice', header: 'cost-price' },
    { field: 'originalSalesPrice', header: 'original-sales-price' },
    { field: 'discount', header: 'discount' },
    { field: 'currency', header: 'currency' },
    { field: 'vatRate', header: 'vat-rate' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'deliveredQuantity', header: 'delivered-quantity' },
    { field: 'completedQuantity', header: 'completed-quantity' },
    { field: 'plantName', header: 'plant' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'costCenterName', header: 'cost-center' },
    // {field: 'orderStatus', header: 'order-detail-status'},
    { field: 'orderDetailStatus', header: 'order-detail-status' },
    { field: 'shippingStatus', header: 'shipping-status' },
    { field: 'priority', header: 'priority' },
  ];

  modal = { active: false };

  private sub: Subscription[] = [];

  commonPriorities = [];

  overdueSale: boolean = false;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if (value && field === 'orderNo') {
      value = String(value).toUpperCase();
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  // step1.1
  modalShow(id, mod: string, data) {
    console.log('@string', id, mod);
    this.salesModal.id = id;
    this.salesModal.modal = mod;
    this.salesModal.data = data;
    this.modal.active = true;
  }

  @Input('dashboardStatus') set ds(status) {
    if (status) {
      this._orderSvc.salesOrderPageOpenFirstTime = true;
      console.log('@status', status)
      if (status === 'OVERDUE_SALE') {
        this.overdueSale = true;
      } else {
        this.overdueSale = false;
        this.pageFilter.orderStatus = status;
        this.filter(this.pageFilter);
      }
    }
  }

  @Input('filterData') set fd(filter) {
    if (filter) {
      // this.selectedColumns = [
      //   { field: 'stockNo', header: 'material-no' },
      //   { field: 'stockName', header: 'material' },
      //   { field: 'warehouseName', header: 'warehouse' },
      // ];
      this._orderSvc.salesOrderPageOpenFirstTime = true;
      this.pageFilter.warehouseId = filter.warehouseId;
      this.pageFilter.warehouseName = filter.warehouseName;
      this.pageFilter.stockId = filter.materialId;
      this.pageFilter.stockNo = filter.materialNo;
      this.pageFilter.stockName = filter.materialName;
      // this.pageFilter.plantId = filter.plantId;
      this.saleOrders = [];
      this.filter(this.pageFilter);
      // this.pageFilter.batch = filter.batch;
    }
  }


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

  jobOrderMenuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportExcel('csv')
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportExcel('xlsx')
      }
    }
  ]


  constructor(
    private _confirmationSvc: ConfirmationService,
    private _enumSaleOrderStatus: EnumOrderStatusService,
    private _translateSvc: TranslateService,
    private appStateSvc: AppStateService,
    private _orderSvc: SalesOrderService,
    public activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _enumSvc: EnumService) {


  }

  ngOnInit() {
    this.sub.push(this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantName = null;
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.preSelectedPlant = res;
      }
      if (!this._orderSvc.salesOrderPageOpenFirstTime) {
        this.resetFilter();
      }
    }));

    this._enumSaleOrderStatus.getOrderEnumList().then(result => this.listOrderStatus = result).catch(error => console.log(error));
    this._enumSaleOrderStatus.getOrderDetailEnumList().then(result => {
      if (result && result.length > 0) {
        this.listOrderDetailStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }


    }).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));

    if (!this.overdueSale) {
      this.sub.push(this._orderSvc.salesOrderItemList.subscribe(result => {
        if (result) {
          this.loaderService.hideLoader();
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.saleOrders = result['content'] as ResponseOrderFilterListDto[];
        } else {
          this.filter(this.pageFilter);
        }
        this._orderSvc.salesOrderPageOpenFirstTime = false;
      }));

    } else {
      this.getOverDueSaleItems();
    }

    this.sub.push(this.activatedRoute
      .queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.pageFilter.plantName = params['plantName'];
          this.pageFilter.stockName = params['materialName'];
          this.pageFilter.warehouseName = params['warehouseName'];
          this.filter(this.pageFilter);
        }
      }));

  }

  getOverDueSaleItems() {
    this._orderSvc.getFilterOverdue(this.pageFilter).then(result => {
      this.loaderService.hideLoader();
      this.pagination.currentPage = result['currentPage'];
      this.pagination.totalElements = result['totalElements'];
      this.pagination.totalPages = result['totalPages'];
      this.saleOrders = result['content'] as ResponseOrderFilterListDto[];
    });
  }


  exportExcel(type: BookType) {
    this.loaderService.showLoader();
    this._orderSvc.filterOrderDetails({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
      .subscribe(result => {
        this.loaderService.hideLoader();
        const mappedDAta = result['content'].filter(itm =>
          (itm.orderDetailStatus === 'IN_PROCESS') || (itm.orderDetailStatus === 'COMPLETED')
          || (itm.orderDetailStatus === 'PARTIAL_COMPLETED')
          || (itm.orderDetailStatus === 'DOCUMENT_CONFIRMED')).map(itm => ({
            'Order Confirmation': itm.referenceId,
            'Work Order': itm.itemReferenceId,
            'Partner': itm.actName,
            Product: itm.stockName,
            'Order No': itm.orderNo,
            Quantity: itm.quantity,
            Unit: itm.unit,
            'Confirm Date': itm.deliveryDate,
            'Production Finish Date': itm.deliveryCompletionDate
          }))
        this.appStateSvc.exportAsFile(mappedDAta, type, 'saleOrders');
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      });
  }

  fitToColumn(arrayOfArray) {
    // get maximum character of each column
    return arrayOfArray.map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i] ? a2[i].toString().length : 0)) }));
  }

  exportCSV(selected = false, type: BookType) {
    if (selected) {
      const mappedDAta = this.selectedSales.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'orderDate') {
            obj[this._translateSvc.instant(col.header)] = itm.orderDate ? new Date(itm.orderDate).toLocaleString() : '';
          } else if (col.field === 'deliveryDate') {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? new Date(itm.deliveryDate).toLocaleString() : '';
          } else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
          }
        })
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'saleOrders');
    } else {
      this.loaderService.showLoader();
      this._orderSvc.filterOrderDetails({
        ...this.pageFilter, pageNumber: 1,
        pageSize: this.pagination.totalElements
      }).subscribe(result => {
        this.loaderService.hideLoader();
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if (col.field === 'orderDate') {
              obj[this._translateSvc.instant(col.header)] = itm.orderDate ? new Date(itm.orderDate).toLocaleString() : '';
            } else if (col.field === 'deliveryDate') {
              obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? new Date(itm.deliveryDate).toLocaleString() : '';
            } else if (itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
            }
          })
          return (obj);
        });
        this.appStateSvc.exportAsFile(mappedDAta, type, 'saleOrders');
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      });
    }
  }
  ngOnDestroy() {
    this._orderSvc.salesOrderItemPageFilter = this.pageFilter;
    this._orderSvc.salesOrderPageOpenFirstTime = false;
    this.sub.forEach(s => s.unsubscribe());
  }
  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  datefilter() {
    this.pageFilter.startDate = this.pageFilter.startDate ? new Date(this.pageFilter.startDate) : null;
    this.pageFilter.endDate = this.pageFilter.endDate ? new Date(this.pageFilter.endDate) : null;
    this.pageFilter.pageNumber = 1;
    this.search(this.pageFilter);
  }

  search(data) {
    setTimeout(() => {
      this.loaderService.showLoader();
    }, 50);

    const temp = Object.assign({}, data);
    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.deliveryDate) {
      temp.deliveryDate = ConvertUtil.localDateShiftAsUTC(temp.deliveryDate);
    }
    if (temp.endDate) {
      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
    }
    
    if (temp.orderStatusList && temp.orderStatusList.length > 0) {
      temp.orderStatusList = temp.orderStatusList.map(x => x.name);
    }
    if (this.overdueSale) this.getOverDueSaleItems();
    else this._orderSvc.searchSaleItemsTerms.next(temp);
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

  showCostCenterDetailDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
  }

  showQuotationIdDialog(id: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERQUOTATION, id);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: 1000,
      query: null,
      orderByProperty: 'orderDate',
      orderByDirection: 'desc',
      actId: null,
      actName: null,
      actNo: null,
      batch: null,
      completedQuantity: null,
      deliveredQuantity: null,
      deliveryDate: null,
      description: null,
      documentNo: null,
      endDate: null,
      orderDetailId: null,
      orderId: null,
      orderNo: null,
      orderStatus: null,
      orderTypeName: null,
      plannedQuantity: null,
      plantName: this.pageFilter.plantName,
      quantity: null,
      startDate: null,
      stockId: null,
      stockName: null,
      warehouseName: null,
      priority: null

    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._orderSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('canceled-operation');
      }
    })
  }

  sendMail2() {
    const data = {
      referenceId: this.salesModal.data.itemReferenceId,
      actId: this.salesModal.data.actId,
      tableType: TableTypeEnum.SALES_ORDER,
      templateTypeCode: CommonTemplateTypeEnum.SALE_ORDER,
      itemId: this.salesModal.id,
      subject: this.salesModal.data.orderNo
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(stockId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showCustomerDetailDialog(customerId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }
  showWarehouseDetailDialog(warehouseId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }
  showOrderDetailDialog(orderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, orderId);
  }


  getPrintHtmlDocument(event: any = null) {
    if (event === 'delivery-note') {
      this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.DELIVERY_NOTE;
    } else {
      this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.SALE_ORDER;
    }
    this.requestPrintDto.plantId = this.preSelectedPlant.plantId;
    this.requestPrintDto.itemId = this.salesModal.id;
    this.printComponent.active = true;
  }

  fixRoundedDigit(value) {

    if (!(Math.ceil(parseFloat(value)) === value)) {
      return value.toFixed(2);
    }
    return value;
  }
}


