import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConfirmationService, MenuItem } from 'primeng';
import { environment } from 'environments/environment';
import { ResponseOrderFilterListDto } from 'app/dto/sale-order/sale-order.model';
import { ConvertUtil } from 'app/util/convert-util';
import { EnumOrderStatusService } from 'app/services/dto-services/enum/order-status.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { PreviousRouteService } from 'app/services/shared/previous-page.service';
import { CommonTemplateTypeEnum, RequestPrintDto } from '../../../../../dto/print/print.model';
import { ActService } from 'app/services/dto-services/act/act.service';
import { BookType } from 'xlsx/types';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-sales-report-order',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ConfirmationService]
})

export class ListSalesReportComponent implements OnInit, OnDestroy{

  listOrderStatus;

  selectedSales;

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

  salesModal = {
    modal: null,
    data: null,
    mainData: null,
    id: null
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



  jobOrderList = null;
  prodOrder = null;


  pageFilter = this._orderSvc.salesOrderPageFilter;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  saleOrders: ResponseOrderFilterListDto[] = [];

  selectedColumns = [
    { field: 'orderNo', header: 'order-no' },
    { field: 'orderDate', header: 'order-date' },
    { field: 'actName', header: 'customer-name' },
    { field: 'actTypeName', header: 'account-type' },
    { field: 'customerOrderNo', header: 'customer-order-no' },
    { field: 'stockName', header: 'material-name' },
    { field: 'quantity', header: 'quantity' },
    { field: 'deliveredQuantity', header: 'delivered-quantity' },
    { field: 'description', header: 'description' },
    { field: 'costCenterName', header: 'cost-center'},
    { field: 'salePrice', header: 'sales-price' },
    { field: 'orderDetailStatus', header: 'status' },
    { field: 'itemReferenceId', header: 'reference-id' },
    { field: 'currentJobOrderOperationName', header: 'current-job-order-operation-name' },
    { field: 'lastCompletedJobOrderOperationDate', header: 'last-completed-job-order-operation-date' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'shippingStatus', header: 'shipping-status' },


  ];
  cols = [
    { field: 'orderId', header: 'order-id' },
    { field: 'customerOrderNo', header: 'customer-order-no' },
    { field: 'quotationNo', header: 'quotation-no' },
    { field: 'quotationId', header: 'quotation-id' },
    { field: 'actName', header: 'customer-name' },
    { field: 'actTypeName', header: 'account-type' },
    { field: 'stockName', header: 'material-name' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName2', header: 'stock-name-2' },
    { field: 'stockName3', header: 'stock-name-3' },
    { field: 'unit', header: 'unit' },
    { field: 'quantity', header: 'quantity' },
    { field: 'costCenterName', header: 'cost-center'},
    { field: 'itemReferenceId', header: 'reference-id' },
    { field: 'description', header: 'description' },
    { field: 'orderNo', header: 'order-no' },
    { field: 'orderStatus', header: 'order-status' },
    { field: 'orderDetailStatus', header: 'status' },
    { field: 'orderDate', header: 'order-date' },
    { field: 'orderType', header: 'order-type' },
    { field: 'salePrice', header: 'sales-price' },
    { field: 'discountPrice', header: 'net-price' },
    { field: 'unitNetPrice', header: 'unit-net-price' },
    { field: 'netPrice', header: 'discount-price' },
    { field: 'vatPrice', header: 'vat' },
    { field: 'originalSalesPrice', header: 'original-sales-price' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'currentJobOrderOperationId', header: 'current-job-order-operation-id' },
    { field: 'currentJobOrderOperationOrderNo', header: 'current-job-orderoperation-order-no' },
    { field: 'currentJobOrderOperationName', header: 'current-job-order-operation-name' },
    { field: 'lastCompletedJobOrderOperationDate', header: 'last-completed-job-order-operation-date' }
  ];

  modal = { active: false };
  invoiceModal = { active: false };

  sub: Subscription[] = [];

  // private searchTerms = new Subject<any>();

  requestPrintDto: RequestPrintDto = new RequestPrintDto();

  printComponent = { active: false };

  @Input('dashboardStatus') set ds(status) {
    if (status) {
      this.pageFilter.orderStatus = status;
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
    this.salesModal.id = id;
    this.salesModal.modal = mod;
    this.modal.active = true;
    this.salesModal.mainData = data
  }

  modalSOQShow(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERQUOTATION, id);
  }


  constructor(private _confirmationSvc: ConfirmationService,
    private _enumSaleOrderStatus: EnumOrderStatusService,
    private _translateSvc: TranslateService,
    private _orderSvc: SalesOrderService,
    private _actSvc: ActService,
    private datePipe: DatePipe,
    private appStateService: AppStateService,
    private previouUrlSvr: PreviousRouteService,
    private loaderService: LoaderService, private utilities: UtilitiesService) {

    this.sub.push(this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
         
      }
      if (!this._orderSvc.salesOrderPageOpenFirstTime) {
        this.resetFilter();
      }
    }));
    this.sub.push(this.appStateService.organizationAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.organizationId = null;
      } else {
        this.pageFilter.organizationId = res.organizationId;
      }
    }));

  }

  ngOnInit() {

    

    this._enumSaleOrderStatus.getOrderEnumList().then(result => {
      if (result && result.length > 0) {
        this.listOrderStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res;
        });
      }
      
      

    }

    ).catch(error => console.log(error));


    this.sub.push(this._orderSvc.salesOrderReportList.subscribe(result => {
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

    if (this.previouUrlSvr.getPreviousUrl() !== '/inventory-management/order-management/sales-orders/items') {
      this.resetFilter();
      this._orderSvc.salesOrderPageOpenFirstTime = false;
    }
  }


  exportCSV(selected = false, type: BookType) {
    if (selected) {
      const mappedDAta = this.selectedSales.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'orderDate') {
            obj[this._translateSvc.instant(col.header)] = itm.orderDate ? this.datePipe.transform(new Date (itm.orderDate), 'dd/MM/yyyy') : '';
          } else if (col.field === 'deliveryDate') {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? this.datePipe.transform(new Date (itm.deliveryDate), 'dd/MM/yyyy') : '';
          }  else if (col.field === 'lastCompletedJobOrderOperationDate') {
            obj[this._translateSvc.instant(col.header)] = itm.lastCompletedJobOrderOperationDate ? this.datePipe.transform(new Date (itm.lastCompletedJobOrderOperationDate), 'dd/MM/yyyy HH:mm') : '';
          } 
        
          else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
          }
        })
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'salesOrdersReport');
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
              obj[this._translateSvc.instant(col.header)] = itm.orderDate ? this.datePipe.transform(new Date (itm.orderDate), 'dd/MM/yyyy') : '';
            } else if (col.field === 'deliveryDate') {
              obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? this.datePipe.transform(new Date (itm.deliveryDate), 'dd/MM/yyyy') : '';
            }  else if (col.field === 'lastCompletedJobOrderOperationDate') {
              obj[this._translateSvc.instant(col.header)] = itm.lastCompletedJobOrderOperationDate ? this.datePipe.transform(new Date (itm.lastCompletedJobOrderOperationDate), 'dd/MM/yyyy HH:mm') : '';
            } else if (itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
            }
          })
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'salesOrdersReport');
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      });
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
    if (temp.orderStatusList && temp.orderStatusList.length > 0) {
      temp.orderStatusList = temp.orderStatusList.map(x => x.name);
     
    }
    // console.log("@beforesend",temp);
    this._orderSvc.searchSaleReportTerms.next(temp);
  }


  getTotalSalesPrice = (saleOrder: any) => {
    return saleOrder?.orderDetailDtoList?.reduce((total, item) => total + item.salePrice, 0) || 0;
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
      actName: null,
      orderNo: null,
      description: null,
      orderStatus: null,
      orderDate: null,
      orderTypeName: null,
      orderStartDate: null,
      orderEndDate: null,
      stockId: null,
      plantId: this.pageFilter.plantId,
      organizationId: this.pageFilter.organizationId,
      deliveryDate: null,
      query: null,
      orderByProperty: 'orderDate',
      orderByDirection: 'desc'
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

  getPrintHtmlDocument(event: any = null) {
    if (event === 'delivery-note') {
      this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.DELIVERY_NOTE;
    } else {
      this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.SALE_ORDER;
    }
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.salesModal.id;
    this.printComponent.active = true;
  }

  onSaveInitialReview(myModal) {
    if (this.salesModal.data && this.salesModal.data?.order && this.salesModal.data?.order?.orderDetailList.length > 1) {
      this.salesModal.modal = 'EDIT';
    } else {
      myModal.hide();
      this.search(this.pageFilter);
    }
  }
  sendMail() {
    if (this.salesModal.mainData && this.salesModal.mainData.actId) {
      this.loaderService.showLoader();

      // const reqDto = {
      //   templateTypeCode: CommonTemplateTypeEnum.SALE_ORDER,
      //   plantId: this.pageFilter.plantId,
      //   itemId: this.salesModal.id
      // };
      // this.printService.getDocumentANDDownload(reqDto, 'Sale_Order_'+reqDto.itemId);

      this._actSvc.getDetail(this.salesModal.mainData.actId).then(result => {
        // this._mediaSvc.listMedia(this.salesModal.data.quotationId, TableTypeEnum.SALES_ORDER)
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
        const referenceId = this.salesModal.mainData.referenceId || '';
        window.open(`mailto:${mail}?subject=${referenceId}&body=`);

      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error);
      });
    }

  }

  sendMail2() {
    const data = {
      referenceId: this.salesModal.mainData.referenceId,
      actId: this.salesModal.mainData.actId,
      tableType: TableTypeEnum.SALES_ORDER,
      templateTypeCode: CommonTemplateTypeEnum.SALE_ORDER,
      itemId: this.salesModal.id,
      sendTo: this.salesModal.mainData.account?.email,
      body: this.salesModal.mainData.account?.emailTemplate,
      subject: this.salesModal.mainData.orderNo
    }
    this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
  }

  showCustomerDetailDialog(customerID: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerID);
  }
  showCostCenterDetailDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
  }

  myUploader(event, form) {
    const formData = new FormData();
    formData.append('fileToUpload ', event.files[0], event.files[0].name);
    this.loaderService.showLoader();
    this._orderSvc.uploadSalesOrderMedia(formData, this.pageFilter.plantId).then(res => {
      this.loaderService.hideLoader();
      form.clear();
      this.utilities.showSuccessToast('file-uploaded');
      this.filter(this.pageFilter)
    }).catch(error => {
      this.loaderService.hideLoader();
      form.clear();
      this.utilities.showErrorToast('error-occurs');
    })
  }
}


