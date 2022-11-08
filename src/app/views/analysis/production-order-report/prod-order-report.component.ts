import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ResponseJobOrderReportDto } from '../../../dto/analysis/daily-report/job-order-report';
import { JobOrderService } from '../../../services/dto-services/job-order/job-order.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { LoaderService } from '../../../services/shared/loader.service';
import { DialogTypeEnum } from '../../../services/shared/dialog-types.enum';
import { environment } from '../../../../environments/environment';

import { ConvertUtil } from '../../../util/convert-util';
import { EnumJobOrderStatusService } from '../../../services/dto-services/enum/job-order-status.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';

import { JobOrderOperation } from 'app/dto/porder/porder.model';
import { Subscription } from 'rxjs';
import { ResponseProductionOrderReport } from 'app/dto/analysis/prod-order-report/production-order-report';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';

@Component({
  selector: 'prod-order-report',
  templateUrl: './prod-order-report.component.html',
  styleUrls: ['./prod-order-report.component.css'],
})
export class ProductionOrderReportComponent implements OnInit, OnDestroy {

  firsLoad = true;

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
    finishDate: null,
    orderByDirection: 'desc',
    orderByProperty: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    prodOrderId: null,
    prodOrderStatus: null,
    query: null,
    startDate: null,
  };

  chartModal = {
    active: false,
    data: {
      jobOrderOperationId: null,
      jobOrderId: null,
      startDate: null,
      endDate: null
    }
  };

  prodChartModal = {
    active: false,
    data: {
      finishDate: null,
      orderByDirection: null,
      orderByProperty: null,
      pageNumber: 1,
      pageSize: 99999,
      plantId: null,
      prodOrderId: null,
      prodOrderStatus: null,
      query: null,
      startDate: null
    },
    jobOrderOperationData: null
  }

  prodOrderStatusList: any;

  jobOrderStatusList;

  jobOrderReportDto: ResponseJobOrderReportDto[];

  jobOrderOperations: JobOrderOperation[] = [];
  sub: Subscription;

  prodOrderReportDto: ResponseProductionOrderReport[];

  @Input('jobOrderFilter') set jobOrder(data) {
    if (data) {
      this.pageFilter.startDate = data.filter.rangeStart;
      this.pageFilter.finishDate = data.filter.rangeEnd;
      this.filter();
    }
  }

  selectedProdOrders = [];

  selectedProdOrderId: any;

  selectedJobOrderOperations: any;

  cols = [
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material-name' },
    { field: 'startDate', header: 'planned-start-date' },
    { field: 'finishDate', header: 'planned-finish-date' },
    { field: 'totalFinishedPercentage', header: 'total-finished-percentage' },
    { field: 'lateTime', header: 'late-time' },
    { field: 'totalPlannedTime', header: 'planned-total-duration' },
    { field: 'totalTime', header: 'actual-total-duration' },
    { field: 'totalCycleTime', header: 'planned-cycle-time' },
    { field: 'actualTotalCycleTime', header: 'actual-cycle-time' },
    { field: 'prodOrderStatus', header: 'status' },
    { field: 'prodOrderReferenceId', header: 'reference-id' },

  ];

  jobOrderOperationColumns = [
    { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'workstationName', header: 'workstation' },
    { field: 'plannedQuantity', header: 'planned-quantity' },
    { field: 'productNormalQuantity', header: 'goods-quantity' },
    { field: 'productScrapQuantity', header: 'scrap-quantity' },
    { field: 'productReworkQuantity', header: 'rework-quantity' },
    
    { field: 'jobOrderActualStartDate', header: 'actual-start-date' },
    { field: 'jobOrderActualFinishDate', header: 'actual-finish-date' },
    { field: 'jobOrderStatus', header: 'status' }

  ];
  plantId: any;


  constructor(
    private jobOrderService: JobOrderService,
    private _jobOrderStatusSvc: EnumJobOrderStatusService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _prodOrderService: ProductionOrderService,
    private _enumProdSvc: EnumPOrderStatusService
  ) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plantId = null;
      } else {
        this.plantId = res.plantId;
        this.pageFilter.plantId = this.plantId;
        if (this.pageFilter.startDate && this.pageFilter.finishDate) {
          this.filter();
        }
      }
    });

  }


  ngOnInit() {
    // this.pageFilter.startDate = new Date(ConvertUtil.getPreviousDate(new Date(), 5));
    // this.pageFilter.finishDate = new Date();
    this._enumProdSvc.getProdOrderStatusEnum().then(result => this.prodOrderStatusList = result).catch(error => console.log(error));

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

filter() {
  this.pageFilter.pageNumber = 1;
  this.search();
}
search() {
    this.firsLoad = false;
    this.loaderService.showLoader();
    // use temp because we dont want to change date field in front end.
    const temp = Object.assign({}, this.pageFilter);
    // const ofset = moment().utcOffset();
    // temp.startDate = moment.utc(this.pageFilter.startDate).startOf('day').toDate();
    // temp.finishDate = moment.utc(this.pageFilter.finishDate).endOf('day').toDate();
    if (temp.startDate) {
      temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    } if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }

    this._prodOrderService.prodOrderReport(temp).then(result => {
      this.loaderService.hideLoader();
      this.prodOrderReportDto = (result['content'] as ResponseProductionOrderReport[]);
      this.normalizeValues(this.prodOrderReportDto);
      this.pagination.currentPage = result['currentPage'];
      this.pagination.totalElements = result['totalElements'];
      this.pagination.totalPages = result['totalPages'];

    }).catch(err => {
      this.loaderService.hideLoader();
      this.jobOrderReportDto = [];
      this.utilities.showErrorToast(err);
    });
  }


  normalizeValues(res: ResponseProductionOrderReport[]) {
    const me = this;
    res.map(item => {
      item.lateTime = me.getReadableTime(item.lateTime);
      item.totalTime = me.getReadableTime(item.totalTime);
      item.totalPlannedTime = me.getReadableTime(item.totalPlannedTime);
      item.totalCycleTime = me.getReadableTime(item.totalCycleTime);
      item.actualTotalCycleTime = me.getReadableTime(item.actualTotalCycleTime);
      item.jobOrderOperationList = (item.jobOrderOperationList && item.jobOrderOperationList.length > 0) ? me.normalizeOperationValues(item.jobOrderOperationList) : []
    });
  }

  normalizeOperationValues(res: any) {
    const me = this;

    res.map(item => {
      // item.jobOrderActualStartDate = ConvertUtil.localDate2UTC(item.jobOrderActualStartDate);
      item.singleProductCycleTime = me.getReadableTime(item.singleProductCycleTime);
      item.singleProductCycleTimeActual = me.getReadableTime(item.singleProductCycleTimeActual);
      item.netWorkingTime = me.getReadableTime(item.netWorkingTime);
      item.preparingTime = me.getReadableTime(item.preparingTime);
      item.minPreparingTime = me.getReadableTime(item.minPreparingTime);
      item.jobWaitingTime = me.getReadableTime(item.jobWaitingTime);
      item.machineOccupancy = ConvertUtil.fix(item.machineOccupancy, 2);
      item.capacityEfficiency = me.getPercentage(item.capacityEfficiency);
      item.quantityEfficiency = me.getPercentage(item.quantityEfficiency);
      item.timeEfficiency = me.getPercentage(item.timeEfficiency);
      item.quantityPerformance = me.getPercentage(item.quantityPerformance);
      item.qualityPerformance = me.getPercentage(item.qualityPerformance);
      item.powerCost = ConvertUtil.fix(item.powerCost, 2);
      item.powerConsumption = ConvertUtil.fix(item.powerConsumption, 4);
      item.singleProductPowerConsumption = ConvertUtil.fix(item.singleProductPowerConsumption, 4);
      item.singleProductPowerCost = ConvertUtil.fix(item.singleProductPowerCost, 2);
    });

    return res;
  }

  filterByColumn(value, field) {
    this.pageFilter[field] = value;
    this.filter();
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      startDate: null,
      finishDate: null,
      plantId: null,
      query: null,
      orderByProperty: 'jobOrderId',
      orderByDirection: 'desc',
      prodOrderId: null,
      prodOrderStatus: null,
    };
    this.filter();
  }

  onProductionOrderChange(event) {
    const detailItem = event;
    if (detailItem) {
      this.selectedProdOrderId = detailItem.prodOrderId;
      this.pageFilter.prodOrderId = this.selectedProdOrderId;
    } else {
      this.selectedProdOrderId = null;
      this.pageFilter.prodOrderId = null;
    }
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  isLoading() {
    return this.loaderService.isLoading();
  }


  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showJobOrderReportDetail(rowData) {
    this.chartModal.active = true;
    this.chartModal.data.jobOrderOperationId = rowData.jobOrderOperationId;
    this.chartModal.data.startDate = this.pageFilter.startDate;
    this.chartModal.data.endDate = this.pageFilter.finishDate;
    this.chartModal.data.jobOrderId = rowData.jobOrderId;
  }

  openProductionOrderChart(rowData){
    const temp = Object.assign({}, rowData);

    // if (temp.startDate) {
    //   temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
    //   temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    // } if (temp.finishDate) {
    //   temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
    //   temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    // }
    this.prodChartModal.data.prodOrderId = temp.prodOrderId;
    this.prodChartModal.data.startDate = this.pageFilter.startDate;
    this.prodChartModal.data.finishDate = this.pageFilter.finishDate;
    this.prodChartModal.data.plantId = this.pageFilter.plantId;
    this.prodChartModal.data.prodOrderStatus = temp.prodOrderStatus;
    this.prodChartModal.jobOrderOperationData = temp.jobOrderOperationList;
    this.prodChartModal.active = true;
    console.log('@prodChartModal', this.prodChartModal)

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
      this.search();
    }, 500);
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return 0;
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  showProdOrderDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, +id);
  }

  showStockDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, +id);
  }

}
