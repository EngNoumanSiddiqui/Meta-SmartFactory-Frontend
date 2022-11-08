import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ConvertUtil } from 'app/util/convert-util';
import {CommonTemplateTypeEnum, RequestPrintDto} from '../../../../../../dto/print/print.model';
@Component({
  selector: 'transfer-good-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListStockTransferReceiptComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  stockModal = {
    modal: null,
    id: null
  };
  selectedTransferReceipts;


  activityTypeList: any;
  documentTypeList: any;

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

    startDate: null,
    endDate: null,
    goodsMovementActivityType: null,
    goodMovementDocumentType: null,
    goodsMovementStatus: 'ACTIVE',
    purchaseOrderId: null,
    purchaseOrderDetailId: null,
    prodOrderId: null,
    jobOrderId: null,
    orderId: null,
    orderDetailId: null,
    documentNo: null,
    documentDate: null,
    postingDate: null,
    plantId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  transfers = [];

  showLoader = false;
  selectedColumns = [

    {field: 'goodsMovementActivityType', header: 'activity-type'},
    {field: 'goodMovementDocumentType', header: 'document-type'},
    {field: 'goodsMovementStatus', header: 'status'},
    {field: 'purchaseOrderId', header: 'purchase-order-id'},
    {field: 'prodOrderId', header: 'production-order-id'},
    {field: 'saleOrderId', header: 'order-id'},
    {field: 'documentNo', header: 'document-no'},
    {field: 'documentDate', header: 'document-date'},
    {field: 'postingDate', header: 'posting-date'}
  ];

  cols = [
    {field: 'goodsMovementActivityType', header: 'activity-type'},
    {field: 'goodMovementDocumentType', header: 'document-type'},
    {field: 'goodsMovementStatus', header: 'status'},
    {field: 'purchaseOrderId', header: 'purchase-order-id'},
    {field: 'prodOrderId', header: 'production-order-id'},
    {field: 'saleOrderId', header: 'order-id'},
    {field: 'documentNo', header: 'document-no'},
    {field: 'documentDate', header: 'document-date'},
    {field: 'postingDate', header: 'posting-date'}
  ];

  modal = {active: false};
  private searchTerms = new Subject<any>();

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = {active: false};
  sub: Subscription;

  constructor(private _stockReceiptSvc: StockTransferReceiptService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private appStateService: AppStateService,
              private _enumSvc: EnumService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.plantId = null;
                  } else {
                    this.pageFilter.plantId = res.plantId;
                  }
                  this.filter(this.pageFilter);
                });

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

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._stockReceiptSvc.filterObservable(term))).subscribe(
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

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    } if (temp.endDate) {
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
      pageSize: this.pageFilter.pageSize,
      plantId: this.pageFilter.plantId,
      startDate: null,
      endDate: null,
      goodsMovementActivityType: null,
      goodMovementDocumentType: null,
      goodsMovementStatus: 'ACTIVE',
      purchaseOrderId: null,
      purchaseOrderDetailId: null,
      prodOrderId: null,
      jobOrderId: null,
      orderId: null,
      orderDetailId: null,
      documentNo: null,
      documentDate: null,
      postingDate: null,

      query: null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 4;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.GOODS_MOVEMENT;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.stockModal.id;
    this.printComponent.active = true;
  }

  showPurchaseOrderDetailDialog(purchaseOrderId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, purchaseOrderId);
  }

  showDetailDialog(id, type: string) {
    this.loaderService.showDetailDialog(DialogTypeEnum[type], id);
  }
}

