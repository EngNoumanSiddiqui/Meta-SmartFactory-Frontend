import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { environment } from 'environments/environment';
import { EnumStockTransferReceiptService } from 'app/services/dto-services/enum/stock-transfer-receipt.service';
import { WarehouseService } from 'app/services/dto-services/warehouse/warehouse.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
@Component({
  selector: 'customer-transfer-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListCustomerTransferComponent implements OnInit {

  customerId;

  @Input('customerId') set customer(customerId) {
   if (customerId) {
    this.pageFilter.actId = customerId;
    this.customerId = customerId;
    this.filter(this.pageFilter);
   }
  };

  selectedTransferReceipts;

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
    wareHouseFromName: null,
    wareHouseToName: null,
    receiptNo: null,
    documentNo: null,
    startDate: null,
    endDate: null,
    goodsMovementActivityType: null,
    goodMovementDocumentType: null,
    goodsMovementStatus: null,
    defected: null,
    stockTransferReceiptStatus: null,
    stockTransferDirection: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    actId: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  transfers = [];

  listTransferStatus;
  listWareHouses;
  activityTypeList;
  documentTypeList;
  showLoader = false;
  selectedColumns = [
    // {field: 'actName', header: 'act-name'},
    {field: 'goodMovementDocumentType', header: 'document-type'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'materialName', header: 'material'},
    {field: 'batch', header: 'batch'},
    {field: 'wareHouseFromName', header: 'warehouse-from'},
    {field: 'quantity', header: 'quantity'},
    {field: 'baseUnit', header: 'base-unit'}
  ];
  cols = [
    {field: 'actName', header: 'act-name'},
    {field: 'goodsMovementActivityType', header: 'activity-type'},
    {field: 'goodMovementDocumentType', header: 'document-type'},
    {field: 'goodsMovementStatus', header: 'status'},
    {field: 'purchaseOrderId', header: 'purchase-order-id'},
    {field: 'prodOrderId', header: 'production-order-id'},
    {field: 'saleOrderId', header: 'order-id'},
    {field: 'documentNo', header: 'document-no'},
    {field: 'documentDate', header: 'document-date'},
    {field: 'postingDate', header: 'posting-date'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'plantName', header: 'plant'},
    {field: 'materialName', header: 'material'},
    {field: 'batch', header: 'batch'},
    {field: 'isDefected', header: 'defect'},
    {field: 'wareHouseFromName', header: 'warehouse-from'},
    {field: 'wareHouseToName', header: 'warehouse-to'},
    {field: 'quantity', header: 'quantity'},
    {field: 'baseUnit', header: 'base-unit'}
  ];
  stockModal = {
    modal: null,
    id: null
  };

  modal = {active: false};
  private searchTerms = new Subject<any>();
  constructor(private _enumTransferStatus: EnumStockTransferReceiptService,
              private _wareHouseSvc: WarehouseService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private _stockReceiptSvc: StockTransferReceiptService,
              private loaderService: LoaderService) {

  }
  modalShow(id, mod: string) {

    this.stockModal.id = id;
    this.stockModal.modal = mod;

    this.modal.active = true;
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  ngOnInit() {
    this._enumSvc.getGoodsMovementActivityTypeList().then(result => {
      this.activityTypeList = result;
    }).catch(error => console.log(error));

    this._enumSvc.getGoodsMovementDocumentTypeList().then(result => {
      this.documentTypeList = result;
    }).catch(error => console.log(error));
    this._enumTransferStatus.getEnumList().then(result => this.listTransferStatus = result).catch(error => console.log(error));
    this._wareHouseSvc.getIdNameList().then(result => this.listWareHouses = result).catch(error => console.log(error));

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._stockReceiptSvc.filterDetailsObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.transfers = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.transfers = [];
        this.utilities.showErrorToast(error);
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
    data['orderId'] = data['saleOrderId'];

    if (data['orderByProperty'] === 'saleOrderId') {
      data['orderByProperty'] = 'orderId';
    }
    const temp = Object.assign({}, data);

    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.endDate) {
      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
    }

    this.searchTerms.next(temp);
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      wareHouseFromName: null,
      wareHouseToName: null,
      receiptNo: null,
      documentNo: null,
      startDate: null,
      endDate: null,
      goodsMovementActivityType: null,
      goodMovementDocumentType: null,
      goodsMovementStatus: null,
      defected: null,
      stockTransferReceiptStatus: null,
      stockTransferDirection: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      actId: null
    };
    this.filter(this.pageFilter);
  }


}

