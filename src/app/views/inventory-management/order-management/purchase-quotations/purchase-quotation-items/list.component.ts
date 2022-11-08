import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
@Component({
  selector: 'purchase-quotation-item-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class PurchaseQuotationItemListComponent implements OnInit, OnDestroy {
  // @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  preSelectedPlant: any;

  modal2 = { active: false };

  purchaseQuotationModal = {
    modal: null,
    id: null,
    mainid: null,
  };

  showLoader = false;
  PurchaseQuotationStatuses = [ {name:'OPENED'}, {name:'CLOSED'}, {name:'CANCELLED'} ];

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

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
  pageFilter = this.purchaseQuotationSvc.purchaseQuotationItemPageFilter;
  selectedColumns = [
    { field: 'purchaseQuotationDetailId', header: 'purchase_quotation_detail_id' },
    { field: 'purchaseQuotationId', header: 'purchase_quotation_id' },
    { field: 'stockNo', header: 'stock-no' },
    { field: 'stockName', header: 'stock-name' },
    { field: 'vendor', header: 'vendor' },
    { field: 'requestedQuantity', header: 'request-quantity' },
    { field: 'quotedQuantity', header: 'quoted-quantity' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'orderUnit', header: 'order-unit' },
    { field: 'purchaseQuotationDetailStatus', header: 'purchase_quotation_detail_status' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'createDate', header: 'create-date' },
  ];

  cols = [
    { field: 'purchaseQuotationDetailId', header: 'purchase_quotation_detail_id' },
    { field: 'purchaseQuotationId', header: 'purchase_quotation_id' },
    { field: 'plant', header: 'plant' },
    { field: 'stockNo', header: 'stock-no' },
    { field: 'stockName', header: 'stock-name' },
    { field: 'vendor', header: 'vendor' },
    { field: 'requestedQuantity', header: 'request-quantity' },
    { field: 'quotedQuantity', header: 'quoted-quantity' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'orderUnit', header: 'order-unit' },
    { field: 'purchaseQuotationDetailStatus', header: 'purchase_quotation_detail_status' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'createDate', header: 'create-date' },
  ];

  sub: Subscription[] = [];

  commonPriorities = [];
  purchaseQuotationItemList: any;
  selectedPurchaseQuotationItems: any;
 
  @Input('filterData') set fd(filter) {
    console.log('@filterData', filter)
    if (filter) {
      this.pageFilter.warehouseId = filter.warehouseId;
      this.pageFilter.warehouseName = filter.warehouseName;
      this.pageFilter.stockId = filter.materialId;
      this.pageFilter.stockName = filter.materialName;
      this.pageFilter.plantId = filter.plantId;
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
    private _translateSvc: TranslateService,
    private purchaseQuotationSvc: PurchaseQuotationService,
    private appStateSvc: AppStateService,
    private loaderService: LoaderService,
    public activatedRoute: ActivatedRoute,
    private utilities: UtilitiesService) {
    this.sub.push(this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.preSelectedPlant = res;
      }
      if (!this.purchaseQuotationSvc.purchaseQuotationItemPageOpenFirstTime) {
        this.resetFilter();
      }
    }));
  }
  modalShow(id, mod: string, mainId) {
    this.modal2.active = true;
    this.purchaseQuotationModal.id = id;
    this.purchaseQuotationModal.mainid = mainId;
    this.purchaseQuotationModal.modal = mod;
    // this.myModal.show();
  }

  ngOnInit() {
    
    this.sub.push(this.purchaseQuotationSvc.purchaseQuotationItemList.subscribe(result => {
      if (result) {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.purchaseQuotationItemList = result['content'];
        this.loaderService.hideLoader();
      } else {
        this.filter(this.pageFilter);
      }
      this.purchaseQuotationSvc.purchaseQuotationItemPageOpenFirstTime = false;
    }));
    this.sub.push(this.activatedRoute.queryParams.subscribe(params => {
        if (Object.keys(params).length > 0) {
          this.pageFilter.plantName = params['plantName'];
          this.pageFilter.stockName = params['materialName'];
          this.pageFilter.warehouseName = params['warehouseName'];
          this.filter(this.pageFilter);
        }
      }));
  }

  ngOnDestroy() {
    this.purchaseQuotationSvc.purchaseQuotationItemPageOpenFirstTime = true;
    this.purchaseQuotationSvc.purchaseQuotationItemPageOpenFirstTime = this.pageFilter;
    this.sub.forEach(s => s.unsubscribe());
  }

 
  
  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
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
    if (temp.purchaseQuotationDetailStatusList && temp.purchaseQuotationDetailStatusList.length > 0) {
      temp.purchaseQuotationDetailStatusList = temp.purchaseQuotationDetailStatusList.map(x => x.name);
    }
    this.purchaseQuotationSvc.searchpurchaseQuotationItemTerms.next(temp);
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
      orderByProperty: 'purchaseQuotationDetailId',
      orderByDirection: 'desc',
      baseUnit: null,
      batch: null,
      createDate: null,
      currency: null,
      deliveryCost: null,
      deliveryDate: null,
      effectivePrice: null,
      netPrice: null,
      orderUnit: null,
      plantId: this.pageFilter.plantId,
      purchaseQuotationDetailId: null,
      purchaseQuotationDetailStatus: null,
      purchaseQuotationId: null,
      query: null,
      quotedQuantity: null,
      requestedQuantity: null,
      stockId: null,
      unitPrice: null,
      updateDate: null,
      validUntil: null,
    }
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.purchaseQuotationSvc.deleteDetailItem(id)
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

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showMaterialDetailDialog(stockId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showVendorDetailDialog(stockId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, stockId);
  }

  showWarehouseDetailDialog(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }

  fixRoundedDigit(value) {

    if (!(Math.ceil(parseFloat(value)) === value)) {
      return value.toFixed(2);
    }
    return value;
  }
}

