import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { PreviousRouteService } from 'app/services/shared/previous-page.service';
import {CommonTemplateTypeEnum, RequestPrintDto} from '../../../../../dto/print/print.model';
import { Router } from '@angular/router';

@Component({
  selector: 'purchase-quotation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class PurchaseQuotationListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  modal2 = {active: false};
  POmodal = {active: false, modal: null};

  pQuotationModal = {
    modal: null,
    id: null
  };
  showLoader = false;

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  purchaseQuotations = [];
  selectedPurchaseQuotations: any;
  PurchaseQuotationStatuses = [{name: "REQUESTED"},{name: "COMPLETED"},{name:"OPENED"},{name:"CONFIRMED"},{name:"CLOSED"},{name:"PROCESSING"},{name:"CANCELLED"}];

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
  pageFilter = this._purchaseQuotationSvc.purchaseQuotationPageFilter;

  selectedColumns = [
    {field: 'purchaseQuotationId', header: 'purchase_quotation_id'},
    {field: 'vendor', header: 'vendor'},
    {field: 'purchaseQuotationStatus', header: 'purchase_quotation_status'},
    {field: 'requiredDate', header: 'required-date'},
    {field: 'createDate', header: 'create-date'},
    {field: 'description', header: 'description'}
  ];

  cols = [
    {field: 'purchaseQuotationId', header: 'purchase_quotation_id'},
    {field: 'vendor', header: 'vendor'},
    {field: 'costCenter', header: 'cost-center'},
    {field: 'purchaseQuotationStatus', header: 'purchase_quotation_status'},
    {field: 'requiredDate', header: 'required-date'},
    {field: 'createDate', header: 'create-date'},
    {field: 'description', header: 'description'}
  ];

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = {active: false};
  sub: Subscription[] = [];

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _purchaseQuotationSvc: PurchaseQuotationService,
              private loaderService: LoaderService,
              private previouUrlSvr: PreviousRouteService,
              private router: Router,
              private appStateService: AppStateService,
              private utilities: UtilitiesService) {

               this.sub.push( this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.plantId = null;
                  } else {
                    this.pageFilter.plantId = res.plantId;
                  }
                  if (!this._purchaseQuotationSvc.purchaseQuotationPageOpenFirstTime) {
                    this.resetFilter();
                }
                }));


  }

  modalShow(id, mod: string) {
    this.modal2.active = true;
    this.pQuotationModal.id = id;
    this.pQuotationModal.modal = mod;
  }

  ngOnInit() {
    this.sub.push(this._purchaseQuotationSvc.purchaseQuotationList.subscribe(result => {
      if (result) {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.purchaseQuotations = result['content'];
        this.loaderService.hideLoader();
      } else {
        this.filter(this.pageFilter);
      }
      this._purchaseQuotationSvc.purchaseQuotationPageOpenFirstTime = false;
    }));

    if (!((this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/items') ||
    (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/base') ||
    (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/quotations/items')
    )) {
      this.resetFilter();
      this.filter(this.pageFilter);
      this._purchaseQuotationSvc.purchaseQuotationItemPageOpenFirstTime = false;
    }

  }

  ngOnDestroy() {
    this._purchaseQuotationSvc.purchaseQuotationPageOpenFirstTime = true;
    this._purchaseQuotationSvc.purchaseQuotationPageFilter = this.pageFilter;
    this.sub.forEach(s => s.unsubscribe());
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();

    const temp = Object.assign({}, data);

    if (temp.createDate) {
      temp.createDate = ConvertUtil.localDateShiftAsUTC(temp.createDate);
    } if (temp.requiredDate) {

      // temp.requiredDate = ConvertUtil.date2EndOfDay(temp.requiredDate);
      temp.requiredDate = ConvertUtil.localDateShiftAsUTC(temp.requiredDate);
    }
    if (temp.purchaseQuotationStatusList && temp.purchaseQuotationStatusList.length > 0) {
      temp.purchaseQuotationStatusList = temp.purchaseQuotationStatusList.map(x => x.name);
    }

    this._purchaseQuotationSvc.searchPurchaseQuotationTerms.next(temp);
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

  showSupplierDetail(supplierId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, supplierId);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      orderByProperty: 'purchaseQuotationId',
      orderByDirection: 'desc',
      createDate: null,
      description: null,
      purchaseQuotationId: null,
      purchaseQuotationStatus: null,
      query: null,
      plantId: this.pageFilter.plantId,
      requiredDate: null,
      updateDate: null,
      vendorId: null,
    }
    this.filter(this.pageFilter);
  }

  showCostCenterDetailDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
  }

  

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._purchaseQuotationSvc.delete(id)
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

  onModelPOClosed(mymodel) {
    mymodel.hide();
    this.router.navigateByUrl("/inventory-management/order-management/purchase-orders/base");
  }
  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 1;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.PURCHASE_ORDER_QUOTATION;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.pQuotationModal.id;
    this.printComponent.active = true;
  }
}

