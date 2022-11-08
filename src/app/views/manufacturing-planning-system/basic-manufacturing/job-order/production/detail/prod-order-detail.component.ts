import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {ProductionOrderService} from 'app/services/dto-services/production-order/production-order.service';
import { ResponseJobOrderDetailDto, ResponseJobOrderFilterDto } from 'app/dto/job-order/job-order.model';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ConvertUtil } from 'app/util/convert-util';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import {CommonTemplateTypeEnum, RequestPrintDto} from '../../../../../../dto/print/print.model';
import { ImageViewerComponent } from 'app/views/image/image-viewer/image-viewer.component';
import { TableTypeEnum } from 'app/dto/table-type-enum';
import domToPdf from 'dom-to-pdf';
import { Tree } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-prod-order-detail',
  templateUrl: './prod-order-detail.component.html',
  styleUrls: ['./prod-order-detail.component.scss']
})
export class ProdOrderDetailComponent implements OnInit {
  @ViewChild(ImageViewerComponent) imageViewerComponent: ImageViewerComponent;
  @ViewChild(Tree) ptree: Tree ;

  @Output() onDataRetreived  = new EventEmitter<any>();
  showMaterialNo = false;
  showOriginal = false;
  showCancelled = false;
  showComponentChecked = false;
  isProcessMaterial = true;
  isSemiFinished = true;
  isRawMaterial = true;


  cols = [
    {field: 'orderNo', header: 'order-no'},
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {field: 'jobOrderOperations', header: 'operation'},
    {field: 'jobOrderStockUseList', header: 'material-input'},
    {field: 'plannedQuantity', header: 'needed-input-quantity'},
    {field: 'jobOrderStockProduceList', header: 'material-output'},
    {field: 'plannedQuantity', header: 'needed-output-quantity'},
    // {field: 'batch', header: 'batch'},
    {field: 'produceQuanity', header: 'produced-quantity'},
    {field: 'defectQuantity', header: 'scrap'},
    {field: 'reservedQuantity', header: 'reserved-quantity'},
    {field: 'singleDuration', header: 'planned-single-duration'},
    {field: 'singleTotalDuration', header: 'total-duration'},
    {field: 'actualTotalDuration', header: 'actual-total-duration'},
    {field: 'variableCost', header: 'planned-cost'},
    {field: 'currency', header: 'currency'},
    {field: 'operationStatus', header: 'operation-status'},
    {field: 'workStation', header: 'Workstation'},
    {field: 'plannedStart', header: 'planned-start'},
    {field: 'plannedFinish', header: 'planned-finish'},
    {field: 'jobOrderStatus', header: 'job-order-status'},
    {field: 'referenceId', header: 'reference-id'}
  ];
  reservationSelectedColumns = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    // { field: 'status', header: 'status' },
    // { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'warehouseFromName', header: 'warehouse-from' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'locationNo', header: 'location-no' },
    { field: 'barcode', header: 'barcode' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'deliveredQuantity', header: 'delivered-quantity' },
    { field: 'waitingForJobQuantity', header: 'reserved-job-order-quantity' },
    { field: 'waitingForJobOrderOperationId', header: 'reserved-job-order-operation-id' },
    // { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestReservationStatus', header: 'stock-reservation-status' },
    // { field: 'movementType', header: 'movement-type' }
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'movementType', header: 'movement-type' },
    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },

  ];
  reservationCols = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    { field: 'status', header: 'status' },
    { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementDate', header: 'requirement-date' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestStockReservationStatus', header: 'stock-reservation-status' },
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },
    { field: 'withdrawnQuantity', header: 'quantity-withdrawn' },
    { field: 'enteredUnitQuantity', header: 'quantity-in-entered-unit' },
    { field: 'enteredUnitMeasure', header: 'entered-unit-of-measure' },
    { field: 'prodOrderId', header: 'production-order' },
    { field: 'saleOrderId', header: 'sales-order' },
    { field: 'orderDetailId', header: 'sales-order-item' },
    { field: 'movementType', header: 'movement-type' },
  ];
  panel = {title: null, visible: false, data:null};
  reqChangeJobOrderOperationStatusDto = {
    finishDate: null,
    jobOrderOperationId: null,
    startDate: null
  };

  jobDetail: any;
  jobOrderList: any;
  selectedJobOrderList: any;
  reservationList: any;
  fullReservationList: any;

  dialog = { visible: false }
  TreeViewFiles = [];
  selectedTreeViewFile = null;

  params = {
    numberOfJobs: null, jobList: [], error: ''
  };

  showLoader = false;
  prodOrderId = 0;
  tabIndex = 0;
  selectedReservationRow: any;
  modal = {active: false};
  editModal = {active: false};
  totalElements: number;
  finishDate: Date;

  @Input('prodOrderId') set jobOrder(prodOrderId) {
    if (prodOrderId) {
      this.prodOrderId = prodOrderId;
      // this.shiftBasedStockReportPageFilter.prodOrderId = prodOrderId;
      this.initialize(prodOrderId);
    } else {
      this.jobDetail = null;
    }
  }
  @Input('prodOrderData') set jobOrderData(prodOrderData) {
    if (prodOrderData) {
      const result = JSON.parse(JSON.stringify(prodOrderData));
      this.jobDetail = result as ResponseJobOrderDetailDto;
      this.onDataRetreived.emit(this.jobDetail);
      this.pageFilter.prodOrderId = this.jobDetail.prodOrderId;
      if (this.jobDetail) {
        if(this.showOriginal) {
          let localjobOrderList = [...this.jobDetail.jobOrderList];
          localjobOrderList.sort((a, b) => parseInt(a.jobOrderId) - parseInt(b.jobOrderId));
          localjobOrderList = ConvertUtil.removeDuplicatedDataInArray(localjobOrderList, 'orderNo');
          localjobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
          this.jobOrderList = [...localjobOrderList];
        } else {
          this.jobOrderList = [...this.jobDetail.jobOrderList];
        }

        // this.jobOrderList.sort((a, b) => parseInt(a.orderNo) - parseInt(b.orderNo));
        this.jobOrderList.forEach((jb,jbIndex) => {
          // if (jbIndex === 0) {
          //   jb.orderNo = '10';
          //   jb.orderFNo = '10';
          // } else {
          //   jb.orderNo = this.jobOrderList[jbIndex - 1].orderNo + '10';
          //   jb.orderFNo = this.jobOrderList[jbIndex - 1].orderFNo + '.10';
          // }

          const split = jb.orderNo.toString().match(/.{1,2}/g);
          jb.orderFNo = split.join(".");

        });
        this.jobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
        // this.jobOrderList.sort((a, b) => b.jobOrderId - b.jobOrderId);
        this.fullReservationList = this.jobDetail.reservationList;
        if(this.showCancelled) {
          this.reservationList = this.fullReservationList;
        } else {
          this.reservationList = this.fullReservationList.filter(res => res.latestReservationStatus !== "CANCELLED");
        }
      }
      setTimeout(() => {
        if(this.imageViewerComponent) {
          this.imageViewerComponent.initImages(this.jobDetail.prodOrderId, TableTypeEnum.PRODUCTION_ORDER);
        }
      }, 1000);

      this.finishDate = this.jobDetail.scheduledFinishTime? new Date(this.jobDetail.scheduledFinishTime): new Date(this.jobDetail.finishDate);
    } else {
      this.jobDetail = null;
    }
  }
  requestPrintDto: RequestPrintDto = new RequestPrintDto();

  printComponent = {active: false};

  pageFilter = {
    pageNumber: 1,
    pageSize: 20,
    operationUseName: null,
    jobOrderStatus: null,
    position: null,
    workStationName: null,
    stockUseName: null,
    createDate: null,
    description: null,
    plantId: null,
    startDate: null,
    finishDate: null,
    stockToProduceName: null,
    prodOrderId: null,
    batch: null,
    query: null,
    orderByProperty: 'jobOrderId',
    orderByDirection: 'desc',
    panelActive: null,
    actualStart: null,
    actualFinish: null,
    jobOrderId: null,
  };

  jobOrderStatusList: any;

  private searchJobOrderTerms = new Subject<any>();

  sub: Subscription;

  classReOrder = ['desc'];


  constructor(
    private _prodOrderSvc: ProductionOrderService,
    private utilities: UtilitiesService,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private dateFormatPipe: DatePipe,
    private _jobOrderSvc: JobOrderService,
    private _jobOrderStatusSvc: EnumJobOrderStatusService
    ) {

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        // this.shiftBasedStockReportPageFilter.plantId = res.plantId;
      }
    });
  }


  public initialize(prodOrderId) {
    this.pageFilter.prodOrderId = prodOrderId;
    this.loaderService.showLoader();
    this._prodOrderSvc.getDetail(prodOrderId)
      .then(result => {
        this.jobDetail = result as ResponseJobOrderDetailDto;
        // console.log('@jobDetail', this.jobDetail)
        this.onDataRetreived.emit(this.jobDetail);
        if (this.jobDetail) {

          if(this.showOriginal) {
            let localjobOrderList = [...this.jobDetail.jobOrderList];
            localjobOrderList.sort((a, b) => parseInt(a.jobOrderId) - parseInt(b.jobOrderId));
            localjobOrderList = ConvertUtil.removeDuplicatedDataInArray(localjobOrderList, 'orderNo');
            localjobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
            this.jobOrderList = [...localjobOrderList];
          } else {
            this.jobOrderList = [...this.jobDetail.jobOrderList];
          }
          // this.jobOrderList.sort((a, b) => a.orderNo - b.orderNo);
          this.jobOrderList.forEach((jb,jbIndex) => {

            const split = jb.orderNo.toString().match(/.{1,2}/g);
            jb.orderFNo = split.join(".");
            // if (jbIndex === 0) {
            //   jb.orderNo = '10';
            //   jb.orderFNo = '10';
            // } else {
            //
            //   jb.orderNo = this.jobOrderList[jbIndex - 1].orderNo + '10';
            //   jb.orderFNo = this.jobOrderList[jbIndex - 1].orderFNo + '.10';
            // }

          });
          this.jobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
          this.fullReservationList = this.jobDetail.reservationList;
          if(this.showCancelled) {
            this.reservationList = this.fullReservationList;
          } else {
            this.reservationList = this.fullReservationList.filter(res => res.latestReservationStatus !== "CANCELLED");
          }

        }
        this.loaderService.hideLoader();

        setTimeout(() => {
          if(this.imageViewerComponent) {
            this.imageViewerComponent.initImages(this.prodOrderId, TableTypeEnum.PRODUCTION_ORDER);
          }
        }, 200);

        this.finishDate = this.jobDetail.scheduledFinishTime? new Date(this.jobDetail.scheduledFinishTime): new Date(this.jobDetail.finishDate);

      })
      .catch(error => {
        this.jobDetail = null;
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }

  // public getOpereationNameList(jobOrderId: number): string {
  //   let operationNames = '';
  //
  //   this.jobOrderList.filter(filterItem => filterItem.jobOrderId === jobOrderId)[0].jobOrderOperations
  //     .forEach(item => {
  //       operationNames = item.operationName + ', ';
  //     });
  //   return operationNames.substring(0, operationNames.length - 2);
  // }

  ngOnInit() {
    this.searchJobOrderTerms.pipe(
      debounceTime(400),
      switchMap(term => this._jobOrderSvc.filterObservable(term)))
      .subscribe(
        result => {
          this.jobOrderList = result['content'] as ResponseJobOrderFilterDto[];
          this.loaderService.hideLoader();

          this.jobOrderList.forEach((jb,jbIndex) => {

            const split = jb.orderNo.toString().match(/.{1,2}/g);
            jb.orderFNo = split.join(".");
            // if (jbIndex === 0) {
            //   jb.orderNo = '10';
            //   jb.orderFNo = '10';
            // } else {
            //
            //   jb.orderNo = this.jobOrderList[jbIndex - 1].orderNo + '10';
            //   jb.orderFNo = this.jobOrderList[jbIndex - 1].orderFNo + '.10';
            // }

          });
          // this.jobOrderList.sort((a, b) => b.orderNo - a.orderNo);
          // this.reservationList = this.jobDetail.reservationList;
        },
        error2 => {
          this.jobOrderList = ([] as ResponseJobOrderFilterDto[]);
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error2)
        });
    this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));


    // this.lineChartOptions = this.createOptions('Stock Reports');
  }


  onShowOriginalChanged(event) {
    if(this.showOriginal) {
      let localjobOrderList = [...this.jobDetail.jobOrderList];
      localjobOrderList.sort((a, b) => parseInt(b.jobOrderId) - parseInt(a.jobOrderId));
      localjobOrderList = ConvertUtil.removeDuplicatedDataInArray(localjobOrderList, 'orderNo');
      this.jobOrderList = [...localjobOrderList];
    } else {
      this.jobOrderList = [...this.jobDetail.jobOrderList];
    }

    this.jobOrderList.forEach((jb,jbIndex) => {
      const split = jb.orderNo.toString().match(/.{1,2}/g);
      jb.orderFNo = split.join(".");
    });
    this.jobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  getDuration(duration) {
    if(duration)
      return ConvertUtil.longDuration2DHHMMSSTime(duration);
  }

  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
  showProdOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, jobOrderId);
  }

  showMaterialDetail(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showWorkstationDetail(workStationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStationId);
  }

  showCustomerDetail(customerId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }

  showReservationDetail(reservationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.RESERVATION, reservationId);
  }

  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showWarehouseDetail(warehosueId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehosueId);
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showBatchDetail(batchId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchId);
  }
  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }
  showPurchaseOrderDetailItem(purchaseOrderItemId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, +purchaseOrderItemId);
  }
  showSalesorderDetail(orderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, +orderId);
  }
  showSalesorderItemDetail(orderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, +orderId);
  }

  showProducTreeDetail(prodId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, +prodId);
  }
  showScrapDetail(scrapId){
    this.loaderService.showDetailDialog(DialogTypeEnum.SCRAP, +scrapId);
  }

  showMilestoneDetail(milestoneId){
      this.loaderService.showDetailDialog(DialogTypeEnum.MILESTONE, +milestoneId);
    }

  showProjectDetail(projectId){
        this.loaderService.showDetailDialog(DialogTypeEnum.PROJECT, +projectId);
      }


  getComponentList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const components = itemList.map(o => o.stockName).join(', ');
      return components;
    }
    return '';
  }

  getMaterialList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const materials = itemList.map(o => o.stockName).join(', ');
      return materials;
    }
    return '';
  }

  getOperationList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const operations = itemList.map(o => o.operationName).join(', ');
      return operations;
    }
    return '';
  }
  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 3;
    this.requestPrintDto.itemId = this.prodOrderId;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.PRODUCTION_ORDER;
    this.printComponent.active = true;
  }

  getJobPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 3;
    this.requestPrintDto.itemId = this.prodOrderId;
    this.requestPrintDto.plantId = this.pageFilter.plantId;
      this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.JOB_ORDER_LIST;
    this.printComponent.active = true;
  }



  getOperationDataHeight(operation){
    var data = {
      height: 0,
      totalHeight: 0
    }
    if(operation.jobOrderStockProduceList.length >  operation.jobOrderStockUseList.length){
      data.height = (operation.jobOrderStockProduceList.length + 1) * 25;
      data.totalHeight =operation.jobOrderStockProduceList.length;
    }else{
      data.height = (operation.jobOrderStockUseList.length + 1) * 25;
      data.totalHeight = operation.jobOrderStockUseList.length;
    }

    return data;
  }

  public filter() {
    const temp = Object.assign({}, this.pageFilter);
    if (temp.panelActive === 'true') {
      temp.panelActive = true;
    } else if (temp.panelActive === 'false') {
      temp.panelActive = false;
    } else {
      temp.panelActive = null;
    }
    if (temp.startDate) {
      temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    } if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }
// console.log('@filter', temp)

    this.loaderService.showLoader();
    this.searchJobOrderTerms.next(temp);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }

    if(field == 'workStation'){
      this.pageFilter.workStationName = value;
    }else{
      this.pageFilter[field] = value;
    }
    this.filter();
  }

  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }

  onShowCancelledChanged(event) {
    if(this.showCancelled) {
      this.reservationList = this.fullReservationList;
    } else {
      this.reservationList = this.fullReservationList.filter(res => res.latestReservationStatus !== "CANCELLED");
    }
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
    this.filter();
  }
  isOrderable(item) {
    return item === 'jobOrderId';
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }


  // getInputList = (rowData) => {
  //   return rowData.componentList ? rowData.componentList.filter(itm => itm.direction < 0) || [] : [];
  // }
  // getOutputList = (rowData) => {
  //   return rowData.componentList ? rowData.componentList.filter(itm => itm.direction > 0) || [] : [];
  // }
  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
  }

  onTreeViewClicked() {
    this.TreeViewFiles = this.detailList2Node(this.listToTree(this.jobOrderList));
    this.dialog.visible = true;
  }

  updatNext() {
    this.panel.title="next-job-order";
    this.panel.visible = true;
    this.selectedJobOrderList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
  }

  detailList2Node(detailList, frntlevel?, apilevel?) {
    const me = this;
    if (!apilevel) {
      apilevel = '';
    } else {
      apilevel = apilevel + '';
    }
    if (!frntlevel) {
      frntlevel = '';
    } else {
      frntlevel = frntlevel + '.';
    }
    const list = [];

    if (detailList) {

      detailList.forEach((item, index) => {
        const frntlvl = (frntlevel + (index !== 0 ? (index + 10) : 10));
        const apilvl = (apilevel + (index !== 0 ? (index + 10) : 10));
        const treeNode = me.detail2Node(item, frntlvl, apilvl);
        list.push(treeNode);
      });

    }
    return list;

  }

  detail2Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      const split = detail.orderNo.toString().match(/.{1,2}/g);
      const orderFNo = split.join(".");
      node = {
        data: Object.assign({}, detail, {children: null}, {orderFNo: orderFNo}),
        children: detail.children ? me.detailList2Node(detail.children, frntlevel, apilevel) : [],
        key: ConvertUtil.getSimpleUId(),
        label: this.generatingLabelName(detail, frntlevel),
        expanded: true
      };
      return node;
    }
    return node;

  }
  generatingLabelName(item, frntlevel?) {
    let label ='';
    // label+= '#lvl=(' + frntlevel + ')';
    item?.jobOrderOperations?.forEach((op, index) => {
      if(index>0) {
        label+= ','
      }
      label+= op.operation?.operationName;

      // label+= '#on=(' +  op.orderNo + ')';
    });
    return label;
  }

  listToTree = (arr = []) => {
    let map = {}, node, res = [], i;
    for (i = 0; i < arr.length; i++) {
       map[arr[i].jobOrderId] = i;
       arr[i].children = [];
    };
    for (i = 0; i < arr.length; i++) {
       node = arr[i];
       if (!(node.previousJobOrderId === null || node.previousJobOrderId == 0 || node.previousJobOrderId == '0'
       || !arr[map[node.previousJobOrderId]])) {
          if(!arr[map[node.previousJobOrderId]]?.children) {
            arr[map[node.previousJobOrderId]].children = [];
          }
          arr[map[node.previousJobOrderId]].children.push(node);
       } else {
          res.push(node);
       };
    };
    res = this.sortArray(res);
    return res;
  };

  sortArray(arr: any) {
    arr.sort((a, b) => parseInt(a.orderNo) - parseInt(b.orderNo));
    arr.forEach((ar:any) => {
      if(ar.children && ar.children.length) {
        this.sortArray(ar.children);
      }
    });
    return arr;
  }

  exportPDF() {

    // const content = document.getElementsByTagName('p-dialog');
    // const content = document.getElementById('product-tree-content');
    var options = {
      filename: 'productTreeView.pdf'
    };
    // const pTreee = this.ptree;
    // pTreee.layout = 'vertical';
    this.loaderService.showLoader();
    domToPdf(this.ptree.el.nativeElement, options, () => {
      console.log('done');
      this.loaderService.hideLoader();
    });
  }



  showReservationModal(rowData: any) {
    this.selectedReservationRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
  }

  showEditReservationModal(rowData: any) {
    this.selectedReservationRow = JSON.parse(JSON.stringify(rowData));
    this.editModal.active = true;
  }


  showEditJobOrder(rowData, operation) {
    this.panel.data = operation;
    this.panel.visible = true;
    this.panel.title = 'update-long-term-processing';
    this.reqChangeJobOrderOperationStatusDto.startDate = rowData.startDate? new Date(rowData.startDate): null;
    this.reqChangeJobOrderOperationStatusDto.finishDate = rowData.finishDate? new Date(rowData.finishDate): null;
    this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = operation.jobOrderOperationId;
  }


  OnDivideHide() {
    this.panel.title = null;
    this.panel.visible = false;
    this.panel.data = null;
  }

  openDivideDialog(list) {
      this.panel.visible = true;
      this.panel.title = 'divide-job-order';
      this.panel.data = list;
  }

  selectDivideJobs() {
    this.params.jobList = [];
    for (let i = 1; i <= this.params.numberOfJobs; i++) {
      this.params.jobList.push({name: i, value: 0});
    }
  }

  divideJobs(type) {
    this.params.error = '';
    let total = 0;
    const quantityList = [];
    if (type === 'manual') {

      for (const item of this.params.jobList) {
        total = total + item.value;
        quantityList.push(item.value);
      }
      if (total === this.panel.data.quantity) {
        const data = {jobOrderId: this.panel.data.jobOrderId, quantityList: quantityList};
        this._jobOrderSvc.divideJobOrder(data)
          .then(() => {
            this.utilities.showSuccessToast('success-divided');
            this.panel.visible = false;
            this.initialize(this.prodOrderId);
            this.utilities.showInfoToast('please-update-next-job-orders');
          })
          .catch(error => this.utilities.showErrorToast(error));
      } else {
        this.params.error = this._translateSvc.instant('quantity-not-equal');
      }

    } else if (type === 'auto') {
      for (let i = 0; i < this.params.numberOfJobs - 1; i++) {
        total = total + Math.round(this.panel.data.quantity / this.params.numberOfJobs);
        quantityList.push(Math.round(this.panel.data.quantity / this.params.numberOfJobs));
      }
      quantityList[quantityList.length] = this.panel.data.quantity - total;
      const data = {jobOrderId: this.panel.data.jobOrderId, quantityList: quantityList};
      this._jobOrderSvc.divideJobOrder(data)
        .then(() => {
          this.utilities.showSuccessToast('success-divided');
          this.panel.visible = false;
          this.initialize(this.prodOrderId);
          this.utilities.showInfoToast('please-update-next-job-orders');
        })
        .catch(error => this.utilities.showErrorToast(error));
    }
  }


  jobOrderChangeStatus () {
    this.loaderService.showLoader();
    this._jobOrderSvc.changeToLongTermProcessing(this.reqChangeJobOrderOperationStatusDto).then(res => {
      this.panel.visible = false;
      // this.loaderService.hideLoader();
      this.initialize(this.prodOrderId);
    }).catch(err => console.error(err));
  }

  nextJobOrderCall() {
    this.loaderService.showLoader();
    this._jobOrderSvc.updateNextJobOrders(this.selectedJobOrderList.map(jb => jb.jobOrderId).join(",")).then(res => {
      this.panel.visible = false;
      // this.loaderService.hideLoader();
      this.initialize(this.prodOrderId);
      this.selectedJobOrderList = [];
    }).catch(err => {
      console.error(err);
      this.utilities.showErrorToast(err);
      this.loaderService.hideLoader();
    });
  }
}
