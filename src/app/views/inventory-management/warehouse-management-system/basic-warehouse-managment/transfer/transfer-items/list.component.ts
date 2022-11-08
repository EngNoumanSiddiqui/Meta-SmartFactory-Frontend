import { AppStateService } from 'app/services/dto-services/app-state.service';
import {Component, OnInit, ViewChild} from '@angular/core';


import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { debounceTime, switchMap } from 'rxjs/operators';
@Component({
  selector: 'transfer-item-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListStockTransferReceiptItemsComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  stockModal = {
  modal: null,
  id: null
};
preSelectedPlant:any={
  plantName:null,
  plantId:null
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
    defected: null,
    query: null,
    plantId:null,
    plantName:null,
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
    // {field: 'saleOrderId', header: 'order-id'},
    {field: 'documentNo', header: 'document-no'},
    // {field: 'documentDate', header: 'document-date'},
    // {field: 'postingDate', header: 'posting-date'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'plantName', header: 'plant'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material'},
    {field: 'batch', header: 'batch'},
    {field: 'defected', header: 'defect'},
    {field: 'wareHouseFromName', header: 'warehouse-from'},
    {field: 'wareHouseToName', header: 'warehouse-to'},
    {field: 'quantity', header: 'quantity'},
    {field: 'baseUnit', header: 'base-unit'}
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
    {field: 'postingDate', header: 'posting-date'},
    {field: 'itemNo', header: 'item-no'},
    {field: 'plantName', header: 'plant'},
    {field: 'materialNo', header: 'material-no'},
    {field: 'materialName', header: 'material'},
    {field: 'batch', header: 'batch'},
    {field: 'isDefected', header: 'defect'},
    {field: 'wareHouseFromName', header: 'warehouse-from'},
    {field: 'wareHouseToName', header: 'warehouse-to'},
    {field: 'quantity', header: 'quantity'},
    {field: 'baseUnit', header: 'base-unit'}
  ];

  modal = {active: false};
  private searchTerms = new Subject<any>();

  constructor(private _stockReceiptSvc: StockTransferReceiptService,
              private utilities: UtilitiesService,
              private appStateSvc:AppStateService,
              private loaderService: LoaderService,
              private _enumSvc: EnumService) {
                this.appStateSvc.plantAnnounced$.subscribe(res=>{
                  if(!(res)){
                    this.pageFilter.plantName=null;
                    this.search(this.pageFilter);
                  }
                  else {
                    this.pageFilter.plantName=res.plantName;
                    this.preSelectedPlant.plantName=res.plantName;
                    this.search(this.pageFilter);
                  }
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
  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
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
      pageSize: this.pageFilter.pageSize,

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
      defected: null,
      query: null,
      plantId:null,
      plantName:null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  showPurchaseOrderDetailDialog(purchaseOrderId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDER, purchaseOrderId);
  }

  showProductionOrderDetailDialog(prodOrderId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(materialId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showWareHouseFromDialog(warehouseId: any) {
    console.log('rowData', warehouseId)
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }
}

