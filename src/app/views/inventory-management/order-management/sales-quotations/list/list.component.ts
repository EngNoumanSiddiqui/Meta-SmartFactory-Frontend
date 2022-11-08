import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConfirmationService, MenuItem } from 'primeng';
import { environment } from 'environments/environment';
import { ResponseOrderFilterListDto } from 'app/dto/sale-order/sale-order.model';
import { ConvertUtil } from 'app/util/convert-util';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { PreviousRouteService } from 'app/services/shared/previous-page.service';
import { CommonTemplateTypeEnum, RequestPrintDto } from '../../../../../dto/print/print.model';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { Router } from '@angular/router';
import { ResponseOrderQuotationDto } from 'app/dto/sale-order/sale-order-quotation.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { BookType } from 'xlsx/types';
import { TableTypeEnum } from 'app/dto/table-type-enum';

@Component({
  selector: 'app-sales-order-quotations',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService]
})

export class ListSalesQuotationsComponent implements OnInit, OnDestroy {

  @ViewChild('ListDiv') el: ElementRef;

  listOrderStatus;

  selectedSales = [];

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

  salesModal = {
    modal: null,
    data: null,
    id: null
  };
  SOmodal = {
    modal: null,
    active: false,
    id: null
  };


  pageFilter = this._orderSvc.salesOrderPageFilter;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  saleOrders: ResponseOrderFilterListDto[] = [];

  selectedColumns = [
    { field: 'quotationId', header: 'quotation-id' },
    { field: 'quotationNo', header: 'quotation-no' },
    { field: 'orderId', header: 'order-id' },
    { field: 'customerOrderNo', header: 'customer-order-no' },
    { field: 'actTypeName', header: 'account-type' },
    { field: 'actName', header: 'customer-name' },
    { field: 'totalSalesPrice', header: 'total-sales-price' },
    // {field: 'description', header: 'description'},
    { field: 'quotationDate', header: 'order-date' },
    // { field: 'deliveryDate', header: 'delivery-date' },
    // {field: 'orderTypeName', header: 'order-type-name'},
    { field: 'orderQuotationStatus', header: 'status' },
  ];
  cols = [
    { field: 'quotationId', header: 'quotation-id' },
    { field: 'quotationNo', header: 'quotation-no' },
    { field: 'orderId', header: 'order-id' },
    { field: 'customerOrderNo', header: 'customer-order-no' },
    // {field: 'orderTypeName', header: 'order-type-name'},
    { field: 'actName', header: 'customer-name' },
    { field: 'actTypeName', header: 'account-type' },
    { field: 'costCenter', header: 'cost-center' },
    { field: 'description', header: 'description' },
    { field: 'note', header: 'note' },
    { field: 'quotationDate', header: 'order-date' },
    { field: 'validFrom', header: 'valid-from' },
    { field: 'validTo', header: 'valid-to' },
    { field: 'rejectReason', header: 'reject-reason' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'totalSalesPrice', header: 'total-sales-price' },
    // {field: 'orderTypeName', header: 'order-type-name'},
    { field: 'orderQuotationStatus', header: 'status' },
  ];

  modal = { active: false };

  sub: Subscription[] = [];

  // private searchTerms = new Subject<any>();

  requestPrintDto: RequestPrintDto = new RequestPrintDto();

  printComponent = { active: false };

  selectedQuotationStatus;

  @Input('dashboardStatus') set ds(status) {
    if (status) {
      this.pageFilter.orderQuotationStatus = status;
      this.filter(this.pageFilter);
    }
  }

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
    // console.log("@string", id, mod);

    this.selectedQuotationStatus = '';

    this.salesModal.id = id;
    this.salesModal.modal = mod;
    this.salesModal.data = data;
    this.modal.active = true;
  }


  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _orderSvc: SalesOrderQuotationsService,
    private _actSvc: ActService,
    private appStateService: AppStateService,
    private previouUrlSvr: PreviousRouteService,
    private router: Router,
    private loaderService: LoaderService, private utilities: UtilitiesService) {

    this.sub.push(this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        if (this.pageFilter.plantId === 9999) { //INSTEAD OF 91 - ALL HTS CHANGES WILL BE REMOVED
          this.selectedColumns.push({ field: 'htsStatus', header: 'hts-status' })
          this.cols.push({ field: 'htsStatus', header: 'hts-status' })
        } else {
          if (this.selectedColumns.find(itm => itm.field === 'htsStatus')) {
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'htsStatus'), 1);
          }
          if (this.cols.find(itm => itm.field === 'htsStatus')) {
            this.cols.splice(this.cols.findIndex(itm => itm.field === 'htsStatus'), 1);
          }
        }
      }
      if (!this._orderSvc.salesOrderPageOpenFirstTime) {
        this.resetFilter();
      }
    }));
  }

  ngOnInit() {
    this._orderSvc.getSaleQuotationsStatus().then(result => {
      if (result && result.length > 0) {
        this.listOrderStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
      // this.listOrderStatus = result;
      // if(this.pageFilter?.plantId === 9999) { //INSTEAD OF 91 - ALL HTS CHANGES WILL BE REMOVED
      //   this.listOrderStatus = ['COST_CONFIRMED', ...this.listOrderStatus];
      // }
    }).catch(error => console.log(error));
    this.sub.push(this._orderSvc.salesOrderList.subscribe(result => {
      if (result) {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.saleOrders = result['content'];
      } else {
        this.filter(this.pageFilter);
      }
      this._orderSvc.salesOrderPageOpenFirstTime = false;
    }));
    // this.searchTerms.pipe(
    //   debounceTime(400),
    //   switchMap(term => this._orderSvc.filterObservable(term))).subscribe(
    //   result => {
    //     this.pagination.currentPage = result['currentPage'];
    //     this.pagination.totalElements = result['totalElements'];
    //     this.pagination.totalPages = result['totalPages'];
    //     this.saleOrders = result['content'] as ResponseOrderFilterListDto[];
    //     this.loaderService.hideLoader();
    //   },
    //   error => {
    //     this.loaderService.hideLoader();
    //     this.saleOrders = [];
    //   }
    // );
    // this.filter(this.pageFilter);
    if (this.previouUrlSvr.getPreviousUrl() !== '/inventory-management/order-management/sales-orders/items') {
      this.resetFilter();
      this._orderSvc.salesOrderPageOpenFirstTime = false;
    }
  }
  ngOnDestroy() {
    if (this.previouUrlSvr.getPreviousUrl() === '/inventory-management/order-management/sales-orders/items') {
      this._orderSvc.salesOrderPageOpenFirstTime = true;
    }
    this._orderSvc.salesOrderPageFilter = this.pageFilter;
    this.sub.forEach(s => s.unsubscribe());
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    if (this.pageFilter.plantId) {
      this.search(data);
    }
  }

  search(data) {
    this.loaderService.showLoader();

    const temp = Object.assign({}, data);
    if (temp.orderStartDate) {
      temp.orderStartDate = ConvertUtil.localDateShiftAsUTC(temp.orderStartDate);
    }
    if (temp.orderDate) {
      temp.orderDate = ConvertUtil.localDateShiftAsUTC(temp.orderDate);
    }
    if (temp.deliveryDate) {
      temp.deliveryDate = ConvertUtil.localDateShiftAsUTC(temp.deliveryDate);
    }
    if (temp.orderEndDate) {
      temp.orderEndDate = ConvertUtil.date2EndOfDay(temp.orderEndDate);
      temp.orderEndDate = ConvertUtil.localDateShiftAsUTC(temp.orderEndDate);
    }
    if (temp.quotationDate) {
      temp.quotationDate = ConvertUtil.localDateShiftAsUTC(temp.quotationDate);
    }
    if (temp.orderQuotationStatusList && temp.orderQuotationStatusList.length > 0) {
      temp.orderQuotationStatusList = temp.orderQuotationStatusList.map(x => x.name);
    }
    // console.log("@beforesend",temp);
    this._orderSvc.searchTerms.next(temp);
  }



  onSaveAndCreate(myModal, event) {
    myModal.hide();
    setTimeout(() => {
      this.selectedSales = [];
      this.search(this.pageFilter);
      this.selectedSales.push(event);
      this.SOmodal.active = true;
      this.SOmodal.modal = 'NEW';
    }, 500);
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




  exportCSV(selected: boolean = false, type: BookType) {
    if (selected) {
      const mappedDAta = this.selectedSales.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field == "orderId") {
            obj[this._translateSvc.instant('order-id')] = itm.order?.orderId;
          } else if (col.field == "actTypeName") {
            obj[this._translateSvc.instant(col.header)] = itm.act?.actType?.actTypeName || null;
          } else if (col.field == "actName") {
            obj[this._translateSvc.instant(col.header)] = itm.act?.actName || null;
          } else if (col.field == "quotationDate") {
            obj[this._translateSvc.instant(col.header)] = itm.quotationDate ? new Date(itm.quotationDate).toLocaleString() : '';
          } else if (col.field == "deliveryDate") {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? new Date(itm.deliveryDate).toLocaleString() : '';
          }
          else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'saleQuotation');
    } else {
      this.loaderService.showLoader();
      this._orderSvc.filter({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field == "orderId") {
                obj[this._translateSvc.instant('order-id')] = itm.order?.orderId;
              } else if (col.field == "actTypeName") {
                obj[this._translateSvc.instant(col.header)] = itm.act?.actType?.actTypeName || null;
              } else if (col.field == "actName") {
                obj[this._translateSvc.instant(col.header)] = itm.act?.actName || null;
              } else if (col.field == "quotationDate") {
                obj[this._translateSvc.instant(col.header)] = itm.quotationDate ? new Date(itm.quotationDate).toLocaleString() : '';
              } else if (col.field == "deliveryDate") {
                obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? new Date(itm.deliveryDate).toLocaleString() : '';
              }
              else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateService.exportAsFile(mappedDAta, type, 'saleQuotation');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }
  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      plantId: this.pageFilter.plantId,
      actId: null,
      createDate: null,
      orderId: null,
      orderQuotationDetailId: null,
      orderQuotationStatus: null,
      quaotationId: null,
      quaotationNo: null,
      query: null,
      quotationDate: null,
      stockId: null,
      orderByProperty: 'quotationId',
      orderByDirection: 'desc'
    };
    if (this.pageFilter.plantId)
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
          .catch(error => {
            if (error === 'THERE_ARE_RELATED_DATA_YOU_CAN_NOT_DELETE') {
              this.utilities.showWarningToast(error, 'Production order exists');
            } else {
              this.utilities.showErrorToast(error);
            }
          });
      },
      reject: () => {
        this.utilities.showInfoToast('canceled-operation');
      }
    })
  }

  OnSOModalClosed(mymodel) {
    mymodel.hide();
    this.router.navigateByUrl("/inventory-management/order-management/sales-orders/base/items");
  }

  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 2;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.SALES_ORDER_QUOTATION;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.salesModal.id;
    this.printComponent.active = true;
  }

  sendMail() {
    if (this.salesModal.data && this.salesModal.data.act) {
      // when sendMail clicked status will be changed to OFFER_SENT on Quotation Modal
      this.selectedQuotationStatus = 'OFFER_SENT';

      this.loaderService.showLoader();
      this._actSvc.getDetail(this.salesModal.data.act.actId).then(result => {
        // this._mediaSvc.listMedia(this.salesModal.data.quotationId, TableTypeEnum.SALES_ORDER_QUOTATION)
        // .then((res: any) => {
        //   if(res) {
        //     res.forEach((image: any, index) => {
        //       let div = document.createElement('div');
        //       div.id = 'content'+index;
        //       // div.hidden = true;
        //       div.innerHTML = `<a id='download_file_${index}'
        //       [href]='${image.path}'
        //       #dwm='wmDownload'
        //       [download]='${image.fileName}'>${image.fileName}</a>`;
        //       this.renderer.appendChild(this.el.nativeElement,div);
        //       // document.body.appendChild(div);

        //       setTimeout(() => {
        //         let a = document.getElementById('download_file_'+index);
        //         a.click();
        //         setTimeout(() => {
        //           this.renderer.removeChild(this.el.nativeElement, div);
        //         }, 400);
        //       }, 600)
        //     });
        //   }
        // });
        this.loaderService.hideLoader();
        const mail = result['email'];
        const emailTemplate = result['emailTemplate'];
        const referenceId = this.salesModal.data.quotationNo || '';
        window.open(`mailto:${mail}?subject=${referenceId}&body=${emailTemplate}`);
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
    }

  }

  sendMail2() {
    // when sendMail clicked status will be changed to OFFER_SENT on Quotation Modal
    this.selectedQuotationStatus = 'OFFER_SENT';

    const data = {
      referenceId: this.salesModal.data.quotationNo || '',
      actId: this.salesModal.data.act.actId,
      tableType: TableTypeEnum.SALES_ORDER_QUOTATION,
      templateTypeCode: CommonTemplateTypeEnum.SALES_ORDER_QUOTATION,
      itemId: this.salesModal.id,
      sendTo: this.salesModal.data.act?.email,
      body: this.salesModal.data.act?.emailTemplate,
      subject: this.salesModal.data.quotationNo
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
  }

  showCustomerDetailDialog(customerID: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerID);
  }
  showCustomerDetailORderIdDialog(ORderId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, ORderId);
  }


  ChangeToCostConfirmed(quotationId) {
    if (quotationId) {
      this.initialize(quotationId, 'COST_CONFIRMED');
    }
  }

  Change_OFFER_SENT(rowData) {
    this.selectedSales = [];
    this.selectedSales.push(rowData);
    this.SOmodal.active = true;
    this.SOmodal.modal = 'NEW';
  }

  showCostCenterDetailDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
  }

  private initialize(id: string, status: any) {
    this.loaderService.showLoader();
    this._orderSvc.getDetail(id).then((result: ResponseOrderQuotationDto) => {
      const order = result as any;
      if (result['act']) {
        order.actId = result['act'].actId;
        order.actTypeId = result['act'].actType?.actTypeId;
      }
      order.orderQuotationStatus = status;
      order.orderQuotationDetailList.forEach((item: any) => {
        item.deliveryDate = new Date(item.deliveryDate);
        order.deliveryDate = item.deliveryDate;
        item.plantName = item.plant?.plantName || this.pageFilter?.plantName;
        item.plantId = item.plant?.plantId || this.pageFilter?.plantId;
        item.stockNo = item.stock?.stockNo;
        item.stockName = item.stock?.stockName;
        item.stockId = item.stock?.stockId;
        item.orderDetailQuotationStatus = status;
      });

      this._orderSvc.save(order).then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        this.filter(this.pageFilter);
      }).catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });


  }


}


