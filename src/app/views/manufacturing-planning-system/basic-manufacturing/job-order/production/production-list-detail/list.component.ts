import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ResponseJobOrderFilterDto } from 'app/dto/job-order/job-order.model';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import * as moment from 'moment';
@Component({
  selector: 'prod-order-list-detail',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProductionOrderListDetailComponent implements OnInit, OnDestroy {

  allJobs: Array<any> = [];

  private searchTerms = new Subject<any>();

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 200, 500, 1000],
    rows: 20,
    tag: ''
  };

  pageFilter = {
    // need to provide the prod-order filter
    pageNumber: 1,
    pageSize: 20,
    operationUseName: null,
    jobOrderStatus: null,
    position: null,
    workStationName: null,
    projectId: null,
    milestoneId: null,
    stockUseName: null,
    description: null,
    stockToProduceName: null,
    scheduledStartTime: null,
    scheduledFinishTime: null,
    prodOrderId: null,
    query: null,
    orderByProperty: 'prodOrderId',
    orderByDirection: 'desc',
    materialName: null,
    orderType: null,
    actualFinish: null,
    actualStart: null,
    baseUnit: null,
    batch: null,
    createDate: null,
    finishDate: null,
    fromDate: null,
    grQuantity: null,
    materialId: null,
    orderDetailId: null,
    orderQuantity: null,
    orderUnit: null,
    plannedQuantity: null,
    plantId: null,
    plantName: null,
    prodOrderStatus: null,
    prodOrderType: null,
    quantity: null,
    receiptNo: null,
    startDate: null,
    stockName: null,
    stockNo: null,
    toDate: null,
    wareHouseId: null,
    wareHouseName: null,
    priority: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  dialog = {
    visible: false,
    mode: null,
    data: null
  };
  isData: boolean = false;


  @Input('milestoneId') set setmilstone(milestoneId) {
    if(milestoneId) {
      this.pageFilter.milestoneId = milestoneId
      if(this.pageFilter.plantId) {
        this.filter();
      }
    }
  }

  @Input('data') set setDataProd(data) {
    if(data) {
      this.isData = true;
      this.allJobs = [...data];
      this.allJobs.forEach((prd: any) => {
        if(prd.prodOrderStatus == 'REQUESTED') {
          prd.htsStatus = 'WAITING_FINAL_REVIEW';
        } else if(prd.prodOrderStatus == 'READY') {
          prd.htsStatus = 'READY_FOR_PRODUCTION';
        }
      })
    }
  }

  cancelAutoPorders = {
    plantId: null,
    date: null,
  }

  jobOrderStatusList;

  jobOrderPositionList;

  prodOrderStatusList;

  prodOrderTypeList;

  selectedJobOrders = [];

  selectedColumns = [
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'prodOrderType', header: 'order-type' },
    { field: 'quantity', header: 'quantity' },
    { field: 'deliveryQuantity', header: 'produced-quantity' },
    { field: 'milestone', header: 'milestone' },
    { field: 'prodOrderStatus', header: 'status' },
    { field: 'startDate', header: 'planned-start-date' },
    { field: 'finishDate', header: 'planned-finish-date' },
    { field: 'scheduledStartTime', header: 'scheduled-start-date' },
    { field: 'scheduledFinishTime', header: 'scheduled-finish-date' }
  ];

  cols = [
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'materialName', header: 'material' },
    { field: 'materialNo', header: 'material-number' },
    { field: 'plantName', header: 'plant-name' },
    { field: 'prodOrderType', header: 'order-type' },
    { field: 'prodOrderStatus', header: 'status' },
    { field: 'batch', header: 'batch' },
    { field: 'quantity', header: 'quantity' },
    { field: 'deliveryQuantity', header: 'produced-quantity' },
    { field: 'grQuantity', header: 'GR-Quantity' },
    { field: 'orderUnit', header: 'order-unit' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'wareHouseName', header: 'store-location' },
    { field: 'milestone', header: 'milestone' },
    { field: 'priority', header: 'priority' },
    { field: 'createDate', header: 'create-date' },
    { field: 'startDate', header: 'planned-start-date' },
    { field: 'finishDate', header: 'planned-finish-date' },
    { field: 'actualStart', header: 'actual-start' },
    { field: 'actualFinish', header: 'actual-finish' },
    { field: 'scheduledStartTime', header: 'scheduled-start-date' },
    { field: 'scheduledFinishTime', header: 'scheduled-finish-date' }

  ];

  sub: Subscription;

  commonPriorities = [];

  constructor(private _jobOrderStatusSvc: EnumJobOrderStatusService,
    private _prodOrderSvc: ProductionOrderService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private enumProdOrderService: EnumPOrderStatusService) {


  }



  filter() {
    this.pageFilter.pageNumber = 1;
    this.search();
  }

  

  search() {

    this.loaderService.showLoader();
    const temp = Object.assign({}, this.pageFilter);
    if (temp.startDate) {
      temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    } if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }
    if (temp.scheduledStartTime) {
      temp.scheduledStartTime = ConvertUtil.date2StartOfDay(temp.scheduledStartTime);
      temp.scheduledStartTime = ConvertUtil.localDateShiftAsUTC(temp.scheduledStartTime);
    } if (temp.scheduledFinishTime) {
      temp.scheduledFinishTime = ConvertUtil.date2EndOfDay(temp.scheduledFinishTime);
      temp.scheduledFinishTime = ConvertUtil.localDateShiftAsUTC(temp.scheduledFinishTime);
    }
    this.searchTerms.next(temp);
  }

  

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(500),
      switchMap(term => this._prodOrderSvc.filterProdObservable(term))).subscribe(
        result => {
          this.allJobs = result['content'];
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.allJobs.forEach((prd: any) => {
            if(prd.prodOrderStatus == 'REQUESTED') {
              prd.htsStatus = 'WAITING_FINAL_REVIEW';
            } else if(prd.prodOrderStatus == 'READY') {
              prd.htsStatus = 'READY_FOR_PRODUCTION';
            }
          })
          this.loaderService.hideLoader();
        },
        error2 => {
          this.allJobs = ([] as ResponseJobOrderFilterDto[]);
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error2)
        });
    // this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));
    this.enumProdOrderService.getProdOrderStatusEnum().then(result => this.prodOrderStatusList = result).catch(error => console.log(error));
    this._jobOrderStatusSvc.getJobOrderPositionList().then(result => this.jobOrderPositionList = result).catch(error => console.log(error));
    this.enumService.getProductionOrderTypeList().then(result => this.prodOrderTypeList = result).catch(error => console.log(error));
    this.enumService.getCommonPriorityEnum().then((result: any) => this.commonPriorities = result).catch(error => console.log(error));

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantName = null;
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        if(this.pageFilter.plantId === 9999) { //INSTEAD OF 91 - ALL HTS CHANGES WILL BE REMOVED
          if(this.selectedColumns.find(itm => itm.field === 'prodOrderStatus')) {
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'prodOrderStatus') + 1 ,0,{field: 'htsStatus', header: 'hts-status'})
          } else {
            this.selectedColumns.push({field: 'htsStatus', header: 'hts-status'})
          }
          this.cols.push({field: 'htsStatus', header: 'hts-status'})
        } else {
          if(this.selectedColumns.find(itm => itm.field === 'htsStatus')) {
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'htsStatus'), 1);
          }
          if(this.cols.find(itm => itm.field === 'htsStatus')) {
            this.cols.splice(this.cols.findIndex(itm => itm.field === 'htsStatus'), 1);
          }
        }
        if(!this.isData) {
          this.filter();
        }
        
      }

    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  
 

  reOrderData(id, item: string) {
    if (!this.isOrderable(item)) {
      return;
    }
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.search();
  }

  isOrderable(item) {
    return item !== 'workStationName'
      && item !== 'operationUseName'
      && item !== 'operationNameNext'
      && item !== 'stockToProduceName'
      && item !== 'stockUseName';
  }



  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter();
  }

  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showProdOrderDetail(prodOrderData) {
    // this.dialog.data = prodOrderData;
    // this.dialog.mode = 'prod-details';
    // this.dialog.visible = true;
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderData);
  }
  

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }

  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(materialId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showWareHouseDetailDialog(wareHouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, wareHouseId);
  }

  
  
  


  onRowSelect(event) {

    // const selectedJobOrders = this.selectedJobOrders.filter(item => item.prodOrderStatus==='PLANNED' ||
    // item.prodOrderStatus==='READY' || item.prodOrderStatus==='PROCESSING' ||
    // item.prodOrderStatus==='REQUESTED' || item.prodOrderStatus==='CONFIRMED');
    // console.log('@selectedJobOrders', selectedJobOrders);
    // if (selectedJobOrders.length >=2) {
    //   this.enableCancelAllBtn = true;
    // } else {
    //   this.enableCancelAllBtn = false;
    // }

  }

  OnTableChecked(event) {
    this.onRowSelect(event);
  }

  onRowUnselect(event){
    this.onRowSelect(event);
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
    this.search();
  }




  


}
