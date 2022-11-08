import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MenuItem} from 'primeng';

import { AppStateService } from 'app/services/dto-services/app-state.service';

import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { PreviousRouteService } from 'app/services/shared/previous-page.service';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import {CommonTemplateTypeEnum, RequestPrintDto} from '../../../../../dto/print/print.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { MediaService } from 'app/services/media/media.service';
import { BookType } from 'xlsx/types';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListPorderComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  modal2 = {active: false};
  invoiceModal = {active: false};

  porderModal = {
    modal: null,
    id: null,
    data: null
  };
  showLoader = false;

  classReOrder = ['asc', 'asc', 'asc', 'asc'];
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
  porders = [];
  listPorderStatus;
  purchaseOrderType;
  selectedCauses;

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
  pageFilter = this._porderSvc.purchaseOrderPageFilter;

  selectedColumns = [
    {field: 'porderId', header: 'porder-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'porderNo', header: 'porder-no'},
    {field: 'supplierName', header: 'vendor'},
    {field: 'purchaseOrderStatus', header: 'purchase-order-status'},
    {field: 'requestedByName', header: 'requested-by'},
    {field: 'purchaseOrderType', header: 'purchase-order-type'},
    {field: 'porderDate', header: 'porder-date'}
  ];

  cols = [
    {field: 'porderId', header: 'porder-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'porderNo', header: 'porder-no'},
    {field: 'costCenter', header: 'cost-center'},
    {field: 'requestedByName', header: 'requested-by'},
    {field: 'porderDate', header: 'porder-date'},
    {field: 'purchaseOrderType', header: 'purchase-order-type'},
    {field: 'description', header: 'description'},
    {field: 'supplierName', header: 'vendor'},
    {field: 'purchaseOrderStatus', header: 'purchase-order-status'},
  ];

  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = {active: false};
  sub: Subscription[] = [];

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

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumPorderStatus: EnumPOrderStatusService,
              private _saleSvc: SalesOrderService,
              private _actSvc: ActService,
              private _purchaseQuotationSvc: PurchaseQuotationService,
              private _translateSvc: TranslateService,
              private _porderSvc: PorderService,
              private loaderService: LoaderService,
              private _mediaSvc: MediaService,
              private previouUrlSvr: PreviousRouteService,
              private appStateService: AppStateService,
              private datePipe: DatePipe,
              private utilities: UtilitiesService) {

               this.sub.push( this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.plantId = null;
                  } else {
                    this.pageFilter.plantId = res.plantId;
                  }
                  if (!this._porderSvc.purchaseOrderPageOpenFirstTime) {
                    this.resetFilter();
                }
                }));
                this.sub.push( this.appStateService.organizationAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.organizationId = null;
                  } else {
                    this.pageFilter.organizationId = res.organizationId;
                  }
                }));


  }

  modalShow(id, mod: string, rowData) {
    this.modal2.active = true;
    this.porderModal.id = id;
    this.porderModal.modal = mod;
    this.porderModal.data = rowData;
  }

  sendMail() {
    if(this.porderModal.data && this.porderModal.data.account) {
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
        const referenceId = this.porderModal.data.referenceId|| '';
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
      actId: this.porderModal.data.account?.actId,
      tableType: TableTypeEnum.PURCHASE_ORDER,
      templateTypeCode: CommonTemplateTypeEnum.PURCHASE_ORDER,
      itemId: this.porderModal.id,
      sentTo: this.porderModal.data.account?.email,
      subject: this.porderModal.data.porderNo,
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
  }


  ngOnInit() {
    // order-type
    this._saleSvc.getPurchaseOrderTypes().then(result =>{

      if (result && result.length > 0) {
        this.listPorderStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }
      
    ).catch(error => console.log(error));
    this._enumPorderStatus.getEnumList().then(result =>{

      if (result && result.length > 0) {
        this.purchaseOrderType = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    } ).catch(error => console.log(error));
    this.sub.push(this._porderSvc.purchaseOrderList.subscribe(result => {
      if (result) {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.porders = result['content'];
        this.loaderService.hideLoader();
      } else {
        this.filter(this.pageFilter);
      }
      this._porderSvc.purchaseOrderPageOpenFirstTime = false;
    }));

    if (!((this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/base/items')
    // (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/quotations') ||
    // (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/purchase-orders/quotations/list')
    )) {
      this.resetFilter();
      this.filter(this.pageFilter);
      this._porderSvc.purchaseOrderItemPageOpenFirstTime = false;
      this._purchaseQuotationSvc.purchaseQuotationPageOpenFirstTime = false;
    }

  }

  ngOnDestroy() {
    this._porderSvc.purchaseOrderPageOpenFirstTime = true;
    this._porderSvc.purchaseOrderPageFilter = this.pageFilter;
    this.sub.forEach(s => s.unsubscribe());
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedCauses.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'porderDate') {
            obj[this._translateSvc.instant(col.header)] = itm.porderDate ? this.datePipe.transform(new Date (itm.porderDate), 'dd/MM/yyyy HH:mm') : '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'purchaseorders');
    } else {
      this.loaderService.showLoader();
      this._porderSvc.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'porderDate') {
              obj[this._translateSvc.instant(col.header)] = itm.porderDate ? this.datePipe.transform(new Date (itm.porderDate), 'dd/MM/yyyy HH:mm') : '';
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'purchaseOrders');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
   
  }

  search(data) {
    this.loaderService.showLoader();

    const temp = Object.assign({}, data);

    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    } if (temp.endDate) {

      temp.endDate = ConvertUtil.date2EndOfDay(temp.endDate);
      temp.endDate = ConvertUtil.localDateShiftAsUTC(temp.endDate);
    }
    if (temp.porderDate) {
      // temp.porderDate = ConvertUtil.date2EndOfDay(temp.porderDate);
      temp.porderDate = ConvertUtil.localDateShiftAsUTC(temp.porderDate);
    }
    if (temp.purchaseOrderStatusList && temp.purchaseOrderStatusList.length > 0) {
      temp.purchaseOrderStatusList = temp.purchaseOrderStatusList.map(x => x.name);
    }

    if (temp.purchaseOrderTypeList && temp.purchaseOrderTypeList.length > 0) {
      temp.purchaseOrderTypeList = temp.purchaseOrderTypeList.map(x => x.name);
    }

    this._porderSvc.searchPurchaseOrderTerms.next(temp);
  }

  showSupplierDetail(supplierId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, supplierId);
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
  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pagination.pageSize,
      query: null,
      startDate: null,
      endDate: null,
      porderDate: null,
      orderByProperty: 'porderId',
      orderByDirection: 'desc',
      baseUnit: null,
      batch: null,
      plantId: this.pageFilter.plantId,
      organizationId: this.pageFilter.organizationId,
      purchaseOrderStatus: null,
      purchaseOrderType: null,
      orderUnit: null,
      quantity: null,
      stockId: null,
      totalIncomeQuantity: null,
      wareHouseId: null,
      plantName: this.pageFilter.plantName,
      stockName: null,
      warehouseName: null,
    }
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._porderSvc.delete(id)
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

  completePOrder(data) {
    data.supplier = data.supplierId;
    this.loaderService.showLoader();
    this._porderSvc.complete(data)
    .then(() => {
      this.utilities.showSuccessToast('completed-success');
      this.loaderService.hideLoader();
      this.filter(this.pageFilter);
    })
    .catch(error => {
       this.utilities.showErrorToast(error);
       this.loaderService.hideLoader();
    });
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 1;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.PURCHASE_ORDER;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.porderModal.id;
    this.printComponent.active = true;
  }
}

