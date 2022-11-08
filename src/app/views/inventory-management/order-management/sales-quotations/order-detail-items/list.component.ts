import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


import { ActivatedRoute, Router } from '@angular/router';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ConfirmationService, MenuItem } from 'primeng';
import { environment } from 'environments/environment';
import { ResponseOrderFilterListDto } from 'app/dto/sale-order/sale-order.model';
import { Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { SalesOrderQuotationsService } from 'app/services/dto-services/sales-order-quotations/sales-order-quotations.service';
import { BookType } from 'xlsx/types';
import { ActService } from 'app/services/dto-services/act/act.service';
import { CommonTemplateTypeEnum, RequestPrintDto } from 'app/dto/print/print.model';
import { TableTypeEnum } from 'app/dto/table-type-enum';
@Component({
  selector: 'sale-order-items-quotations',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService]
})
export class ListSalesItemsQuotationsComponent implements OnInit, OnDestroy {

  listOrderStatus;

  listOrderDetailStatus;

  selectedSales;

  preSelectedPlant: any = {
    plantName: null,
    plantId: null
  };

  requestPrintDto: RequestPrintDto = new RequestPrintDto();

  printComponent = {active: false};

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
  salesModal = {
    modal: null,
    id: null,
    mainId: null,
    data: null,
  };
  SOmodal = {
    modal: null,
    active: false,
    id: null
  };

  pageFilter = this._orderSvc.salesOrderItemPageFilter;

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  saleOrders: ResponseOrderFilterListDto[] = [];

  selectedColumns = [
    { field: 'quotationDetailId', header: 'quotation-detail-id' },
    { field: 'quotationDetailNo', header: 'quotation-detail-no' },
    { field: 'orderQuotationId', header: 'quotation-id' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material' },
    { field: 'actName', header: 'customer-name' },
    { field: 'costCenterName', header: 'cost-center'},
    // {field: 'actTypeName', header: 'account-type'},
    // { field: 'height', header: 'height' },
    // { field: 'width', header: 'width' },
    { field: 'quantity', header: 'quantity' },
    //{ field: 'baseUnit', header: 'base-unit' },
    { field: 'salePrice', header: 'sales-price' },
    { field: 'currency', header: 'currency' },
    // { field: 'batch', header: 'batch' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'orderDetailQuotationStatus', header: 'order-detail-status' },
    { field: 'priority', header: 'priority' },
  ];

  cols = [
    { field: 'quotationDetailId', header: 'quotation-detail-id' },
    { field: 'orderQuotationId', header: 'quotation-id' },
    { field: 'quotationDetailNo', header: 'quotation-detail-no' },
    { field: 'stockNo', header: 'material-no' },
    { field: 'stockName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'batch', header: 'batch' },
    { field: 'orderType', header: 'order-type' },
    { field: 'actName', header: 'customer-name' },
    {field: 'actTypeName', header: 'account-type'},
    { field: 'height', header: 'height' },
    { field: 'width', header: 'width' },
    { field: 'dimensionUnit', header: 'dimension-unit' },
    { field: 'directProduction', header: 'direct-production' },
    { field: 'description', header: 'description' },
    { field: 'createDate', header: 'order-date' },
    { field: 'costCenterName', header: 'cost-center'},
    { field: 'quantity', header: 'quantity' },
    { field: 'salePrice', header: 'sales-price' },
    { field: 'netPrice', header: 'net-price' },
    { field: 'discount', header: 'discount' },
    { field: 'vat', header: 'vat-rate' },
    { field: 'deliveryDate', header: 'delivery-date' },
    { field: 'warehouseName', header: 'storage-location' },
    { field: 'deliveredQuantity', header: 'delivered-quantity' },
    { field: 'completedQuantity', header: 'completed-quantity' },
    { field: 'baseUnit', header: 'base-unit' },
    // {field: 'orderStatus', header: 'order-detail-status'},
    { field: 'orderDetailQuotationStatus', header: 'order-detail-status' },
    { field: 'priority', header: 'priority' },
  ];

  modal = { active: false };

  private sub: Subscription [] = [];

  commonPriorities = [];
  selectedQuotationStatus: string;

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
  modalShow(id, mod: string, data:any) {
    console.log('@string', id, mod);

    this.selectedQuotationStatus = '';

    this.salesModal.id = id;
    this.salesModal.modal = mod;
    this.salesModal.mainId = data?.orderQuotation?.quotationId;
    this.salesModal.data = data;
    this.modal.active = true;
  }

  // @Input('dashboardStatus') set ds(status){
  //   if(status){
  //     console.log('@status', status)
  //     if(status === 'OVERDUE_SALE'){
  //       this.overdueSale = true;
  //     }else{
  //       this.overdueSale = false;
  //       this.pageFilter.orderStatus = status;
  //       this.filter(this.pageFilter);
  //     }
  //   }
  // }

  @Input('filterData') set fd(filter){
    if(filter){
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
      this.saleOrders = [];
      this.filter(this.pageFilter);
      // this.pageFilter.batch = filter.batch;
    }
  }


  constructor(
    private _confirmationSvc: ConfirmationService,
    private router: Router,
    private _translateSvc: TranslateService,
    private appStateSvc: AppStateService,
    private _actSvc: ActService,
    private _orderSvc: SalesOrderQuotationsService,
    public activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _enumSvc: EnumService) {


  }

  ngOnInit() {

    this._orderSvc.getSaleQuotationsStatus().then(result => this.listOrderStatus = result).catch(error => console.log(error));
    this._orderSvc.getSaleQuotationsStatus().then(result =>{
      if (result && result.length > 0) {
        this.listOrderDetailStatus = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    })
    .catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result: any) => {
      if (result && result.length > 0) {
        this.commonPriorities = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));


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

      this.sub.push(this.appStateSvc.plantAnnounced$.subscribe(res => {
        if (!(res)) {
          this.pageFilter.plantName = null;
        } else {
          this.pageFilter.plantId = res.plantId;
          this.pageFilter.plantName = res.plantName;
          this.preSelectedPlant = res;
        }
        if (!this._orderSvc.salesOrderPageOpenFirstTime) {
          this.resetFilter();
        }
      }));

  }

  // getOverDueSaleItems(){
  //   this._orderSvc.getFilterOverdue(this.pageFilter).then(result => {
  //     this.loaderService.hideLoader();
  //     this.pagination.currentPage = result['currentPage'];
  //     this.pagination.totalElements = result['totalElements'];
  //     this.pagination.totalPages = result['totalPages'];
  //     this.saleOrders = result['content'] as ResponseOrderFilterListDto[];
  //   });
  // }

  ngOnDestroy() {
    this._orderSvc.salesOrderItemPageFilter = this.pageFilter;
    this._orderSvc.salesOrderPageOpenFirstTime = true;
    this.sub.forEach(s => s.unsubscribe());
  }


  exportCSV(selected: boolean = false, type: BookType) {
   if(selected)  {
    const mappedDAta = this.selectedSales.map(itm => {
      const obj = {};
      this.selectedColumns.forEach(col => {
        if(col.field === 'deliveryDate') {
          obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? new Date(itm.deliveryDate).toLocaleString() : '';
        } else if(col.field === 'createDate') {
          obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
        } else if(col.field === 'stockNo') {
          obj[this._translateSvc.instant(col.header)] = itm.stock?.stockNo;
        } else if(col.field === 'stockName') {
          obj[this._translateSvc.instant(col.header)] = itm.stock?.stockName;
        } else if(col.field === 'actName') {
          obj[this._translateSvc.instant(col.header)] = itm.orderQuotation?.act?.actName;
        }  else if(col.field === 'actTypeName') {
          obj[this._translateSvc.instant(col.header)] = itm.orderQuotation?.act?.actType?.actTypeName;
        } else if(col.field === 'orderQuotationId') {
          obj[this._translateSvc.instant(col.header)] = itm.orderQuotation?.quotationId || '';
        } else if(col.field === 'plantName') {
          obj[this._translateSvc.instant(col.header)] = itm.plant?.plantName || '';
        }  else if(col.field === 'costCenterName') {
          obj[this._translateSvc.instant(col.header)] = itm.costCenter?.costCenterName || '';
        } else if(itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
        }
      })
      return (obj);
    });
    this.appStateSvc.exportAsFile(mappedDAta, type, 'saleQuotationItems');
   } else {
    this.loaderService.showLoader();
    this._orderSvc.filterOrderRDetails({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
    .then(result => {
      const mappedDAta = result['content'].map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          
          if(col.field === 'deliveryDate') {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryDate ? new Date(itm.deliveryDate).toLocaleString() : '';
          } else if(col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
          } else if(col.field === 'stockNo') {
            obj[this._translateSvc.instant(col.header)] = itm.stock?.stockNo;
          } else if(col.field === 'stockName') {
            obj[this._translateSvc.instant(col.header)] = itm.stock?.stockName;
          } else if(col.field === 'actName') {
            obj[this._translateSvc.instant(col.header)] = itm.orderQuotation?.act?.actName;
          } else if(col.field === 'actTypeName') {
            obj[this._translateSvc.instant(col.header)] = itm.orderQuotation?.act?.actType?.actTypeName;
          } else if(col.field === 'orderQuotationId') {
            obj[this._translateSvc.instant(col.header)] = itm.orderQuotation?.quotationId;
          } else if(col.field === 'plantName') {
            obj[this._translateSvc.instant(col.header)] = itm.plant?.plantName;
          } else if(col.field === 'costCenterName') {
            obj[this._translateSvc.instant(col.header)] = itm.costCenter?.costCenterName || '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        })
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'saleQuotationItems');
      this.loaderService.hideLoader();
    }, err => {
      this.utilities.showErrorToast(err);
      this.loaderService.hideLoader();
    })
   }
  }

  OnSOModalClosed(mymodel) {
    mymodel.hide();

    this.router.navigateByUrl("/inventory-management/order-management/sales-orders/base/items");
  }



  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.pageFilter.plantId = this.preSelectedPlant?.plantId;
    this.pageFilter.plantName = this.preSelectedPlant?.plantName;
    this.search(this.pageFilter);
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
    if (temp.orderQuotationStatusList && temp.orderQuotationStatusList.length > 0) {
      temp.orderQuotationStatusList = temp.orderQuotationStatusList.map(x => x.name);
    }
    this._orderSvc.searchSaleItemsTerms.next(temp);
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
      query: null,
      orderByProperty: 'orderQuotationDetailId',
      orderByDirection: 'desc',
      deliveryDate: null,
      dimensionUnit: null,
      orderDetailQuotationStatus: null,
      orderQuotationDetailId: null,
      orderQuotationId: null,
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
      priority: null,
      stockId: null,
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._orderSvc.deleteOrderDetail(id)
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


  onSaveAndCreate(myModal, event) {
    myModal.hide();
    setTimeout(() => {
      this.selectedSales=[];
      this.search(this.pageFilter);
      this.selectedSales.push(event);
      this.SOmodal.active=true;
      this.SOmodal.modal='NEW';
    }, 500);
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showCostCenterDetailDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
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
  // showOrderDetailDialog(orderId) {
  //   this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, orderId);
  // }
  fixRoundedDigit(value) {

    if(!value) {
      return '';
    }
    if (!(Math.ceil(parseFloat(value)) === value)) {
      return value.toFixed(2);
    }
    return value;
  }

  sendMail() {
    if(this.salesModal.data && this.salesModal.data.orderQuotation && this.salesModal.data.orderQuotation.act) {
      // when sendMail clicked status will be changed to OFFER_SENT on Quotation Modal
      this.selectedQuotationStatus = 'OFFER_SENT';

      this.loaderService.showLoader();
      this._actSvc.getDetail(this.salesModal.data.orderQuotation.act.actId).then(result => {
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
        const referenceId = this.salesModal.data.orderQuotation?.quotationNo|| '';
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
      referenceId: this.salesModal.data.orderQuotation.quotationNo || '',
      actId: this.salesModal.data?.orderQuotation?.act?.actId,
      tableType: TableTypeEnum.SALES_ORDER_QUOTATION,
      templateTypeCode: CommonTemplateTypeEnum.SALES_ORDER_QUOTATION,
      itemId: this.salesModal.data.orderQuotation.quotationId,
      sendTo: this.salesModal.data.orderQuotation?.act?.email,
      subject: this.salesModal.data.orderQuotation.quotationNo || '',
      emailTemplate: '',
    }

    if (data.actId) {
      this.loaderService.showLoader();
      this._actSvc.getDetail(data.actId).then(result => {
        this.loaderService.hideLoader();
        data.emailTemplate = result['emailTemplate'];

        this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
      }).catch(error => {
        this.loaderService.hideLoader();
        console.log(error);

        this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
      });
    } else {
      this.loaderService.showDetailDialog(DialogTypeEnum.MAIL, null, data);
    }
  }

  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 2;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.SALES_ORDER_QUOTATION;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.itemId = this.salesModal.data.orderQuotation?.quotationId;
    this.printComponent.active = true;
  }

}


