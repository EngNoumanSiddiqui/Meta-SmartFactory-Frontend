import {Component, Input, OnInit} from '@angular/core';
import { environment } from 'environments/environment';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'order-detail-plan',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrderDetailPlanComponent implements OnInit {

  allJobs: any[];

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

    operationUseName: null,
    jobOrderStatus: null,
    workStationName: null,
    stockUseName: null,

    query: null,
    orderByProperty: 'finishDate',
    orderByDirection: 'desc',
    orderDetailId: null
  };

  jobOrderStatusList;
  showLoader = false;
  stockName;
  modal = {
    active: false,
    id: null
  };


  @Input('orderDetailId') set x(orderDetailId) {
    this.pageFilter.orderDetailId = orderDetailId;

    this.filter(this.pageFilter);

  }

  @Input('stockName') set y(stockName) {
    this.stockName = stockName;

  }

  deliveries: any[];


  constructor(private _jobOrderStatusSvc: EnumJobOrderStatusService,
              private _prodOrderSvc: ProductionOrderService,
              private stockTransferSvc: StockTransferReceiptService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }

  modalShow(id) {

    this.modal.id = id;

    this.modal.active = true;
  }

  public initialize() {
    this.filter(this.pageFilter);
  }

  modalProdOrderShow(prodId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodId);
  }
  modalWarehouserShow(prodId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, prodId);
  }
  modalMAterialShow(prodId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, prodId);
  }

  public filter(data) {
    this.loaderService.showLoader();

    this._prodOrderSvc.filter(data)
      .then(result => {
        this.allJobs = result['content'] as any[];
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });

    // here we request late job order plan date
    // this._jobOrderSvc.filter({
    //   orderByProperty: 'finishDate',
    //   orderByDirection: 'desc', pageNumber: 1, pageSize: 1
    // }).then(result => {
    //   const jobs = result['content'] as any[];
    //   if (jobs.length > 0) {
    //     this.finishDateEvent.next(jobs[0].finishDate);
    //   } else {
    //     this.finishDateEvent.next(null);
    //   }
    // })
    //   .catch(error => {
    //     this.utilities.showErrorToast(error);
    //   });


    // this.stockTransferSvc.getOrderDetailTransfers(data.orderDetailId).then(res => {
    //   this.deliveries = res as ResponseStockTransferReceiptDetailDto[];
    // }).catch(err => {
    //   this.utilities.showErrorToast(err);
    // });

    const filterData = {
      pageNumber: 1,
      pageSize: 100,
      goodsMovementActivityType: 'GOODS_ISSUE',
      goodMovementDocumentType: 'SALES_ORDER',
      goodsMovementStatus: 'ACTIVE',
      orderDetailId: data.orderDetailId
    };
    this.stockTransferSvc.filter(filterData)
      .then(result => {
        this.deliveries = result['content'];
        this.loaderService.hideLoader();

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });


  }

  ngOnInit() {
    this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,

      operationUseName: null,
      jobOrderStatus: null,
      workStationName: null,
      stockUseName: null,

      query: null,
      orderByProperty: '',
      orderDetailId: null,
      orderByDirection: 'asc',
    };
    this.filter(this.pageFilter);
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

    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 2500);
  }

  showJobDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

}
