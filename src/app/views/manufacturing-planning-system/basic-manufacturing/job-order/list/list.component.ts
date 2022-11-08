import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ResponseJobOrderFilterDto } from 'app/dto/job-order/job-order.model';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { ConfirmationService, MenuItem } from 'primeng';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import * as moment from 'moment';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { BookType } from 'xlsx';
import { DatePipe } from '@angular/common';
@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListJobOrderComponent implements OnInit, OnDestroy {

  allJobs: ResponseJobOrderFilterDto[];

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

  panel = { title: null, visible: false, data: null };
  reqChangeJobOrderOperationStatusDto = {
    finishDate: null,
    jobOrderOperationId: null,
    startDate: null,
    stockQuantityList: [],
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: 20,
    operationUseName: null,
    jobOrderStatus: null,
    position: null,
    workStationName: null,
    workCenterId: null,
    workCenterTypeId: null,
    inputStockNo: null,
    outputStockNo: null,
    stockUseName: null,
    createDate: null,
    description: null,
    plantId: null,
    startDate: new Date(),
    finishDate: moment().add(7, 'days').toDate(),
    erpPlannedStartDate: null,
    erpPlannedFinishDate: null,
    stockToProduceName: null,
    prodOrderId: null,
    batch: null,
    query: null,
    orderByProperty: 'jobOrderId',
    orderByDirection: 'desc',
    panelActive: null,
    actualStart: null,
    actualFinish: null,
    positionList: [],
    jobOrderStatusList: []
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

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  dialog = {
    mode: null,
    visible: false,
    uniqueId: null,
    data: null
  };

  filterWorkcenter = { pageNumber: 1, pageSize: 500, workCenterName: null, workCenterTypeId: null, plantId: null };
  workcenters;
  workcenterTypes;
  selectedWorkCenters = null;
  selectedWorkCenterTypes = null;

  jobOrderStatusList;

  showMaterialNo = false;

  jobOrderPositionList;

  comparedItems;

  selectedJobOrders;
  inspectionLotModal = { active: false };
  showFullComponents = -10;


  @HostListener('window:resize', ['$event'])
  onWindowResize() {

    setTimeout(() => {
      this.screenHeight();

    }, 50);
  }

  dynamicTableHeight;

  screenHeight() {

    var topDiv = document.getElementById("topDiv").offsetHeight;
    var paddingContainer = 20;
    var header = 55;
    var footer = 50;
    var menuHeading = 50;
    var totalHeightWithoutTable = paddingContainer + topDiv + header + footer + menuHeading;


    if (totalHeightWithoutTable) {
      let resizedHeight = window.innerHeight;

      this.dynamicTableHeight = resizedHeight - totalHeightWithoutTable;
      document.getElementById("mainTable").style.height = this.dynamicTableHeight + "px";
    }


  }


  // list of selected column
  selectedColumns = [
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'prodOrderReferenceId', header: 'prod-order-reference-id' },
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
    // { field: 'orderDetail.orderId', header: 'order-detail-id' },
    { field: 'jobOrderOperations', header: 'operation' },
    { field: 'operationTaskCode', header: 'operation-task-code' },
    // { field: 'jobOrderStockUseListNo', header: 'input-no' },
    { field: 'jobOrderStockUseList', header: 'component-input' },
    // { field: 'jobOrderStockProduceListNo', header: 'output-no' },
    { field: 'jobOrderStockProduceList', header: 'material-output' },
    { field: 'plannedQuantity', header: 'planned-quantity' },
    // { field: 'baseUnit', header: 'base-unit' },
    { field: 'workStation.workStationName', header: 'workstation' },
    { field: 'startDate', header: 'planned-start' },
    { field: 'finishDate', header: 'planned-finish' },
    { field: 'actualEarlyLateness', header: 'actual-early-lateness' },
    { field: 'plannedEarlyLateness', header: 'planned-early-lateness' },
    { field: 'jobOrderStatus', header: 'status' },
    { field: 'jobOrderReferenceId', header: 'job-order-reference-id' }

  ];

  // list of all columns
  cols = [
    { field: 'orderNo', header: 'order-no' },
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'prodOrderReferenceId', header: 'prod-order-reference-id' },
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'orderDetail.orderId', header: 'order-detail-id' },
    { field: 'createDate', header: 'create-date' },
    { field: 'workStation.workStationName', header: 'workstation' },
    { field: 'batch', header: 'batch' },
    { field: 'productionType', header: 'production-type' },
    { field: 'jobOrderStockProduceListNo', header: 'output-no' },
    { field: 'jobOrderStockUseListNo', header: 'input-no' },
    { field: 'jobOrderStockUseList', header: 'component' },
    { field: 'jobOrderStockProduceList', header: 'material' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'orderUnit', header: 'order-unit' },
    { field: 'jobOrderOperations', header: 'operation' },
    { field: 'operationTaskCode', header: 'operation-task-code' },
    { field: 'individualCapacity', header: 'individual-capacity' },
    { field: 'currentQuantity', header: 'produced-quantity' },
    { field: 'plannedQuantity', header: 'planned-quantity' },
    { field: 'description', header: 'description' },
    { field: 'startDate', header: 'planned-start' },
    { field: 'finishDate', header: 'planned-finish' },
    { field: 'erpPlannedStartDate', header: 'erp-planned-start-date' },
    { field: 'erpPlannedFinishDate', header: 'erp-planned-finish-date' },
    { field: 'position', header: 'position' },
    { field: 'jobOrderStatus', header: 'status' },
    { field: 'actualEarlyLateness', header: 'actual-early-lateness' },
    { field: 'plannedEarlyLateness', header: 'planned-early-lateness' },
    { field: 'panelActive', header: 'panel-status' },
    { field: 'panelIP', header: 'panel-ip' },
    { field: 'jobOrderReferenceId', header: 'job-order-reference-id' },
    { field: 'skillGroups', header: 'skill-group' },
    { field: 'actualStart', header: 'actual-start' },
    { field: 'actualFinish', header: 'actual-finish' },
    { field: 'actualTotalDuration', header: 'actual-total-duration' },
    { field: 'singleTotalDuration', header: 'planned-total-duration' },
    { field: 'manualPlanned', header: 'manual-planned' }
  ];

  private searchTerms = new Subject<any>();

  sub: Subscription;

  withPanelSubscription: Subscription;

  isWithPanel: boolean = false;
  jobOrderOperationIds: any;

  constructor(
    private _jobOrderStatusSvc: EnumJobOrderStatusService,
    private _confirmationSvc: ConfirmationService,
    private _jobOrderSvc: JobOrderService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private datePipe: DatePipe,
    private appStateService: AppStateService,
    private _workcenterSvc: WorkcenterService,
    private wcTypesrv: WorkcenterTypeService,
    private loaderService: LoaderService) {
  }

  compareSelecteds() {
    if (!this.selectedJobOrders || this.selectedJobOrders.length < 2) {
      this.utilities.showWarningToast('select-minimum-two-job-order!!');
      return;
    }
    this.comparedItems = Object.assign([], this.selectedJobOrders);

    this.comparedItems = this.comparedItems.sort((a: any, b: any) => {
      const first = a.jobOrderId;
      const second = b.jobOrderId;
      return Number(first) - Number(second);
    });

    this.dialog.visible = true;
    this.dialog.mode = 'compare-model';

  }

  filter() {
    this.pageFilter.pageNumber = 1;
    this.search();
    setTimeout(() => {
      this.screenHeight();
    }, 50);
  }

  onShowMaterialNo(event) {
    if (this.showMaterialNo) {

      this.selectedColumns = [
        { field: 'prodOrderId', header: 'prod-order-id' },
        { field: 'jobOrderId', header: 'job-order-id' },
        { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
        { field: 'jobOrderOperations', header: 'operation' },
        { field: 'jobOrderStockUseListNo', header: 'input-no' },
        { field: 'jobOrderStockProduceListNo', header: 'output-no' },
        { field: 'plannedQuantity', header: 'planned-quantity' },
        { field: 'individualCapacity', header: 'individual-capacity' },
        { field: 'workStation.workStationName', header: 'workstation' },
        { field: 'startDate', header: 'planned-start' },
        { field: 'finishDate', header: 'planned-finish' },
        { field: 'jobOrderStatus', header: 'status' },
        { field: 'referenceId', header: 'reference-id' },
      ];
    } else {

      this.selectedColumns = [
        { field: 'prodOrderId', header: 'prod-order-id' },
        { field: 'jobOrderId', header: 'job-order-id' },
        { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
        { field: 'jobOrderOperations', header: 'operation' },
        { field: 'jobOrderStockUseList', header: 'component-input' },
        { field: 'jobOrderStockProduceList', header: 'material-output' },
        { field: 'plannedQuantity', header: 'planned-quantity' },
        { field: 'individualCapacity', header: 'individual-capacity' },
        { field: 'workStation.workStationName', header: 'workstation' },
        { field: 'startDate', header: 'planned-start' },
        { field: 'finishDate', header: 'planned-finish' },
        { field: 'jobOrderStatus', header: 'status' },
        { field: 'referenceId', header: 'reference-id' },
      ];

    }
  }


  public search() {
    const temp = Object.assign({}, this.pageFilter);
    if (temp.panelActive === 'true') {
      temp.panelActive = true;
    } else if (temp.panelActive === 'false') {
      temp.panelActive = false;
    } else {
      temp.panelActive = null;
    }
    // if (temp.startDate) {
    //   temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
    //   temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    // } if (temp.finishDate) {
    //   temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
    //   temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    // }
    if (temp.jobOrderStatusList && temp.jobOrderStatusList.length > 0) {
      temp.jobOrderStatusList = temp.jobOrderStatusList.map(x => x.name);
    }

    if (temp.positionList && temp.positionList.length > 0) {
      temp.positionList = temp.positionList.map(x => x.name);
    }

    // console.log('@filter', temp)

    this.loaderService.showLoader();
    this.searchTerms.next(temp);
  }

  ClearDates() {
    this.pageFilter.startDate = null;
    this.pageFilter.finishDate = null;
    this.pageFilter.actualStart = null;
    this.pageFilter.actualFinish = null;
    this.filter();
  }

  getReadableTime(time) {
    if (time) {
      return ConvertUtil.longDuration2HHMMSSTime(time)
    } else {
      return '';
    }
  }

  ngOnInit() {

    this.withPanelSubscription = this.appStateService.withPanelSubject.subscribe((res) => {
      // console.log('@isWithPanel', res)
      this.isWithPanel = res;
    });

    this.searchTerms.pipe(
      debounceTime(500),
      switchMap(term => this._jobOrderSvc.filterObservablevs2(term)))
      .subscribe(
        result => {
          // console.log("@debugging",result);
          this.allJobs = result['content'] as ResponseJobOrderFilterDto[];
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.loaderService.hideLoader();
          // console.log(this.allJobs)
        },
        error2 => {
          this.allJobs = ([] as ResponseJobOrderFilterDto[]);
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error2)
        });
    this._jobOrderStatusSvc.getJobOrderEnumList().then((result: any) => {

      if (result && result.length > 0) {
        this.jobOrderStatusList = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    this._jobOrderStatusSvc.getJobOrderPositionList().then((result: any) => {
      if (result && result.length > 0) {
        this.jobOrderPositionList = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }
    }).catch(error => console.log(error));
    // this.filter();

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filterWorkcenter.plantId = res.plantId;
        this.filter();
        this.filterWorkCenterTypes(res.plantId);
        this.filterWorkCenter();
      }

    });
  }

  workcenterChanged(event) {
    if (event) {
      if (event.value?.workCenterId === -1) {
        this.pageFilter.workCenterId = null;
      } else {
        this.pageFilter.workCenterId = event.value?.workCenterId;
      }
    } else {
      this.pageFilter.workCenterId = null;
    }
  }
  workcenterTypeChanged(event) {
    if (event) {
      if (event.value?.workCenterTypeId === -1) {
        this.filterWorkcenter.workCenterTypeId = null;
      } else {
        this.filterWorkcenter.workCenterTypeId = event.value?.workCenterTypeId;
      }
    } else {
      this.filterWorkcenter.workCenterTypeId = null;
    }
    this.pageFilter.workCenterTypeId = this.filterWorkcenter.workCenterTypeId;
    this.filterWorkCenter();
  }

  filterWorkCenter() {
    this._workcenterSvc.filter(this.filterWorkcenter).then(result => {
      this.workcenters = [...[{ workCenterName: 'All', workCenterId: -1 }], ...result['content']];
    }).catch(error => console.log(error));
  }
  filterWorkCenterTypes(plantId: any) {
    this.workcenterTypes = [];
    this.wcTypesrv.getWorkCentreTypeByPlantId(plantId).then((result: any) => {
      this.workcenterTypes = [...[{ workCenterTypeName: 'All', workCenterTypeId: -1 }], ...result];
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  updateJobOrderStatusToReady(jobOrderId) {
    this._jobOrderSvc.changeJobOrderStatusToReady(jobOrderId).then((res) => {
      this.ngOnInit();
    }).catch(error => this.utilities.showErrorToast(error))
  }
  updateJobOrderOperationStatusToPlanned(rowData, jobORderOperationId) {

    // this.panel.data = rowData;
    // // this.jobOrderOperationIds = rowData.jobOrderOperations.map(jbOp => jbOp.jobOrderOperationId);
    // this.panel.title = 'change-to-planned';
    // this.panel.visible = true;
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('are-you-sure-you-want-to-reopen-this-job-order-operation-and-change-status-to-planned'),
      header: this._translateSvc.instant('change-confirmation'),
      icon: 'fa fa-times',
      accept: () => {
        this.loaderService.showLoader();
        const data = { jobOrderOperationId: jobORderOperationId };
        this._jobOrderSvc.removeProcessingStatusToPlanned(data).then(results => {
          this.filter();
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_PLANNED');
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        });
      },
      reject: () => {
        // this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
  rollbackStandByJobOrder(jobOrderId) {
    this._jobOrderSvc.rollbackStandByJobOrder(jobOrderId).then((res) => {
      this.ngOnInit();
    }).catch(error => this.utilities.showErrorToast(error))
  }

  cancelAllJobOrder() {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-times',
      accept: () => {
        this.loaderService.showLoader();
        let jobIds = this.selectedJobOrders.map(itm => this._jobOrderSvc.cancelJobOrder(itm.jobOrderId));
        forkJoin([...jobIds]).subscribe(results => {
          this.filter();
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_CANCEL');
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });


  }

  cancelJobOrder(jobOrderId) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-times',
      accept: () => {
        this.loaderService.showLoader();
        this._jobOrderSvc.cancelJobOrder(jobOrderId).then(() => {
          this.filter();
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_CANCEL');
        }
        ).catch(err => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(err);
        })
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.withPanelSubscription.unsubscribe();
  }

  openCompleteModal(rowData) {
    this.panel.data = rowData;
    this.jobOrderOperationIds = rowData.jobOrderOperations.map(jbOp => jbOp.jobOrderOperationId);
    this.panel.title = 'complete-job-order';
    this.panel.visible = true;
    // this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = rowData.jobOrderOperationId;
    this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = this.jobOrderOperationIds && this.jobOrderOperationIds.length ? this.jobOrderOperationIds[0] : null;
    this.reqChangeJobOrderOperationStatusDto.startDate = rowData.startDate ? new Date(rowData.startDate) : new Date(rowData.createDate);
    this.reqChangeJobOrderOperationStatusDto.finishDate = rowData.finishDate ? new Date(rowData.finishDate) : new Date();
    rowData.jobOrderOperations.forEach(jbOp => {
      if (jbOp.jobOrderStockProduceList && jbOp.jobOrderStockProduceList.length) {
        this.reqChangeJobOrderOperationStatusDto.stockQuantityList = [];
        jbOp.jobOrderStockProduceList.forEach(jbOpStock => {
          this.reqChangeJobOrderOperationStatusDto.stockQuantityList.push({
            stockNo: jbOpStock.stockNo,
            stockName: jbOpStock.stockName,
            defectQuantity: jbOpStock.defectQuantity || 0,
            jobOrderStockId: jbOpStock.jobOrderStockId,
            quantity: jbOpStock.neededQuantity || 0,
            reworkQuantity: jbOpStock.reworkQuantity || 0,
          });
        });
      }
    });
  }

  processToComplete() {
    this.loaderService.showLoader();
    this._jobOrderSvc.removeProcessingStatusToComplete(this.reqChangeJobOrderOperationStatusDto).then(res => {
      this.loaderService.hideLoader();
      this.panel.visible = false;
      this.panel.title = null;
      this.jobOrderOperationIds = [];
      this.panel.data = null;
      this.filter();
      this.utilities.showSuccessToast('job-operation-updated');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast('error', err);
    });
  }

  openCreateInspectionLot() {
    this.inspectionLotModal.active = true;
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._jobOrderSvc.changeJobOrderStatusToCancel(id).then(() => {
          this.filter();
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_CANCEL');
        }
        ).catch(err => {
          this.utilities.showErrorToast(err);
        })
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  EditDialogShow(jobOrderId) {
    this.dialog.mode = 'edit-job-order';
    this.dialog.uniqueId = jobOrderId;
    this.dialog.visible = true;
  }
  turnToReady(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-make-ready'),
      header: this._translateSvc.instant('ready-confirmation'),
      icon: 'fa fa-check',
      accept: () => {
        this._jobOrderSvc.changeJobOrderStatusToReady(id).then(() => {
          this.filter()
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_READY');
        }
        ).catch(err => {
          this.utilities.showErrorToast(err);
        })
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
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
    return item !== 'workStation.workStationName'
      && item !== 'operationUseName'
      && item !== 'operationNameNext'
      && item !== 'stockToProduceName'
      && item !== 'stockUseName'
      && item !== 'jobOrderStockUseList'
      && item !== 'jobOrderStockProduceList'
      && item !== 'jobOrderOperations';
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      prodOrderId: null,
      operationUseName: null,
      workCenterId: null,
      inputStockNo: null,
      outputStockNo: null,
      jobOrderStatus: null,
      workStationName: null,
      plantId: this.pageFilter.plantId,
      erpPlannedStartDate: null,
      erpPlannedFinishDate: null,
      workCenterTypeId: null,
      stockUseName: null,
      description: null,
      stockToProduceName: null,
      startDate: null,
      createDate: null,
      finishDate: null,
      position: null,
      batch: null,
      query: null,
      orderByProperty: 'jobOrderId',
      orderByDirection: 'desc',
      panelActive: true,
      actualStart: null,
      actualFinish: null,
      positionList: [],
      jobOrderStatusList: []
    };
    this.filter();
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

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }

    if (field === 'prodOrderId') {
      this.pageFilter['prodOrderId'] = value;
    } else if (field === 'orderDetail.orderId') {
      this.pageFilter['orderDetailId'] = value;
    } else if (field === 'workStation.workStationName') {
      this.pageFilter['workStationName'] = value;
    } else {
      this.pageFilter[field] = value;
    }
    this.filter();
  }


  showJobOrderDetail(jobOrderData) {
    // this.dialog.data = jobOrderData;
    // this.dialog.visible = true;
    // this.dialog.mode = 'jobOrderDetails';
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderData);
  }
  showProdOrderDetail(prodOrderId) {
    // this.dialog.data = prodOrderData;
    // this.dialog.visible = true;
    // this.dialog.mode = 'prod-details';
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
  }
  hideDetailDialog() {
    this.dialog.mode = null;
    this.dialog.data = null;
    this.dialog.visible = false;
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
  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }
  showBatchDetail(batchCode) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batchCode);
  }
  showOrderDetail(orderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, orderId);
  }

  getComponentList(itemList) {
    // console.log(itemList);
    if (itemList) {
      const components = itemList.map(o => o.stockName).join(', ');
      // const components = itemList.map(o => '<a href="javascript:;" (click)="showStockDetail(o.stockId)">{{o.stockName}} </a>').join(', ');
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

  openProcessModal(rowData) {
    this.panel.data = rowData;
    this.panel.title = 'processing-to-planned';
    this.panel.visible = true;
    this.jobOrderOperationIds = rowData.jobOrderOperations.map(jbOp => jbOp.jobOrderOperationId);
    this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = this.jobOrderOperationIds && this.jobOrderOperationIds.length ? this.jobOrderOperationIds[0] : null;
    // this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = rowData.jobOrderOperationId;
    this.reqChangeJobOrderOperationStatusDto.startDate = new Date(rowData.startDate ? rowData.startDate : new Date());
    this.reqChangeJobOrderOperationStatusDto.finishDate = null;
    this.reqChangeJobOrderOperationStatusDto.stockQuantityList = [];

    rowData.jobOrderOperations.forEach(jbOp => {
      if (jbOp.jobOrderStockProduceList && jbOp.jobOrderStockProduceList.length) {
        jbOp.jobOrderStockProduceList.forEach(jbOpStock => {
          this.reqChangeJobOrderOperationStatusDto.stockQuantityList.push({
            stockNo: jbOpStock.stockNo,
            stockName: jbOpStock.stockName,
            defectQuantity: jbOpStock.defectQuantity,
            jobOrderStockId: jbOpStock.jobOrderStockId,
            quantity: jbOpStock.quantity,
            reworkQuantity: jbOpStock.reworkQuantity,
          });
        });
      }
    });
  }



  processToPlanned() {
    this.loaderService.showLoader();
    this._jobOrderSvc.removeProcessingStatusToPlanned(this.reqChangeJobOrderOperationStatusDto).then(res => {
      // this.getData(this.filterSchedule);
      this.loaderService.hideLoader();
      this.panel.visible = false;
      this.filter();
      this.utilities.showSuccessToast('job-operation-updated');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast('error', err);
    });
  }

  showEndJobForm(jobOrder) {
    this.dialog.data = jobOrder;
    this.dialog.visible = true;
    this.dialog.mode = 'end-job';
    console.log('@dialog', this.dialog);
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if (selected) {
      const mappedDAta = this.selectedJobOrders.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {

          if (col.field === 'prodOrderId') {
            obj[this._translateSvc.instant(col.header)] = itm.prodOrder?.prodOrderId;
          } else if (col.field === 'jobOrderId') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderId;
          } else if (col.field === 'jobOrderOperationId') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderOperationId).join();
          } else if (col.field === 'jobOrderOperations') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.operationName).join();
          } else if (col.field === 'jobOrderStockUseList') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockUseList.map(st => st.stockName).join()).join();
          } else if (col.field === 'jobOrderStockProduceList') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList.map(st => st.stockName).join()).join();
          } else if (col.field === 'plannedQuantity') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList[0].neededQuantity).join();
          } else if (col.field === 'individualCapacity') {
            obj[this._translateSvc.instant(col.header)] = itm.individualCapacity;
          } else if (col.field === 'workStation.workStationName') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.workStationName).join();
          } else if (col.field === 'startDate') {
            obj[this._translateSvc.instant(col.header)] = itm.startDate ? this.datePipe.transform(new Date(itm.startDate), 'dd/MM/yyyy HH:mm') : '';
          } else if (col.field === 'finishDate') {
            obj[this._translateSvc.instant(col.header)] = itm.finishDate ? this.datePipe.transform(new Date(itm.finishDate), 'dd/MM/yyyy HH:mm') : '';
          } else if (col.field === 'actualEarlyLateness') {
            obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.actualEarlyLateness);
          } else if (col.field === 'plannedEarlyLateness') {
            obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.plannedEarlyLateness);
          } else if (col.field === 'jobOrderStatus') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderStatus;
          } else if (col.field === 'jobOrderReferenceId') {
            obj[this._translateSvc.instant(col.header)] = itm.referenceId;
          } else if (col.field === 'skillGroups') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeGenericGroupList;
          } else if (col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.createDate ? this.datePipe.transform(new Date(itm.createDate), 'dd/MM/yyyy HH:mm') : '';
          } else if (col.field === 'singleTotalDuration') {
            obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.jobOrderOperations.map(op => op.singleTotalDuration).join());
          } else if (col.field === 'actualTotalDuration') {
            obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.jobOrderOperations.map(op => op.actualTotalDuration).join());
          } else if (col.field === 'jobOrderStockProduceListNo') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList.map(st => st.stockNo).join()).join();
          } else if (col.field === 'jobOrderStockUseListNo') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockUseList.map(st => st.stockNo).join()).join();
          } else if (col.field === 'operationTaskCode') {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.operationTaskCode).join();
          } else if (col.field === 'prodOrderReferenceId') {
            obj[this._translateSvc.instant(col.header)] = itm.prodOrder?.referenceId;
          }

          else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      })
      this.appStateService.exportAsFile(mappedDAta, type, 'jobOrders');
    } else {
      this.loaderService.showLoader();
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
      this._jobOrderSvc.filterObservablevs2({
        ...temp, pageNumber: 1, pageSize: this.pagination.totalElements
      })
        .subscribe(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field === 'prodOrderId') {
                obj[this._translateSvc.instant(col.header)] = itm.prodOrder?.prodOrderId;
              } else if (col.field === 'jobOrderId') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderId;
              } else if (col.field === 'jobOrderOperationId') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderOperationId).join();
              } else if (col.field === 'jobOrderOperations') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.operationName).join();
              } else if (col.field === 'jobOrderStockUseList') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockUseList.map(st => st.stockName).join()).join();
              } else if (col.field === 'jobOrderStockProduceList') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList.map(st => st.stockName).join()).join();
              } else if (col.field === 'plannedQuantity') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList[0].neededQuantity).join();
              } else if (col.field === 'individualCapacity') {
                obj[this._translateSvc.instant(col.header)] = itm.individualCapacity;
              } else if (col.field === 'workStation.workStationName') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.workStationName).join();
              } else if (col.field === 'startDate') {
                obj[this._translateSvc.instant(col.header)] = itm.startDate ? this.datePipe.transform(new Date(itm.startDate), 'dd/MM/yyyy HH:mm') : '';
              } else if (col.field === 'finishDate') {
                obj[this._translateSvc.instant(col.header)] = itm.finishDate ? this.datePipe.transform(new Date(itm.finishDate), 'dd/MM/yyyy HH:mm') : '';
              } else if (col.field === 'actualEarlyLateness') {
                obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.actualEarlyLateness);
              } else if (col.field === 'plannedEarlyLateness') {
                obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.plannedEarlyLateness);
              } else if (col.field === 'jobOrderStatus') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderStatus;
              } else if (col.field === 'jobOrderReferenceId') {
                obj[this._translateSvc.instant(col.header)] = itm.referenceId;
              } else if (col.field === 'createDate') {
                obj[this._translateSvc.instant(col.header)] = itm.createDate ? this.datePipe.transform(new Date(itm.createDate), 'dd/MM/yyyy HH:mm') : '';
              } else if (col.field === 'singleTotalDuration') {
                obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.jobOrderOperations.map(op => op.singleTotalDuration).join());
              } else if (col.field === 'actualTotalDuration') {
                obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.jobOrderOperations.map(op => op.actualTotalDuration).join());
              } else if (col.field === 'jobOrderStockProduceListNo') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList.map(st => st.stockNo).join()).join();
              } else if (col.field === 'jobOrderStockUseListNo') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.jobOrderStockUseList.map(st => st.stockNo).join()).join();
              } else if (col.field === 'operationTaskCode') {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperations.map(op => op.operationTaskCode).join();
              } else if (col.field === 'prodOrderReferenceId') {
                obj[this._translateSvc.instant(col.header)] = itm.prodOrder?.referenceId;
              }

              else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateService.exportAsFile(mappedDAta, type, 'jobOrders');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }

  exportProcessingCSV() {
    import("xlsx").then(xlsx => {
      this.loaderService.showLoader();
      this._jobOrderSvc.filterObservablevs2({
        pageNumber: 1,
        pageSize: 1000, orderByProperty: 'prodOrderId',
        orderByDirection: 'desc',
        plantId: this.pageFilter.plantId
      }).subscribe(res => {
        // console.log("@debugging",result);
        const allJobs = res['content'] as ResponseJobOrderFilterDto[];
        // const filteredJobs = this.allJobs.filter(jb => jb.jobOrderStatus === 'PROCESSING');
        const groupByProdIdList = allJobs.reduce((groupByProdIdList, item: any) => {
          const group = (groupByProdIdList[item.prodOrder.prodOrderId] || []);
          group.push(item);
          groupByProdIdList[item.prodOrder.prodOrderId] = group;
          return groupByProdIdList;
        }, {});
        // deleting the first element cz it's complete sometimes
        delete groupByProdIdList[Object.keys(groupByProdIdList)[0]];
        const mappedDAta = [];
        for (const [prodId, jobOrderss] of Object.entries(groupByProdIdList)) {
          const obj = {};
          let jbProcComOrders: any = jobOrderss || [];
          jbProcComOrders = jbProcComOrders.filter(jb => (jb.jobOrderStatus !== 'CANCELLED'));
          jbProcComOrders.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
          if (jbProcComOrders.filter(jb => (jb.jobOrderStatus === 'PROCESSING' || jb.jobOrderStatus === 'COMPLETED')).length > 0) {
            obj[this._translateSvc.instant('reference-id')] = jbProcComOrders[0]?.prodOrder?.referenceId;
            // obj[this._translateSvc.instant('account-name')] = jobOrders[0]?.orderDetail?.actName;
            // obj[this._translateSvc.instant('account-type')] = jobOrders[0]?.orderDetail?.actType;
            obj[this._translateSvc.instant('prod-order-id')] = prodId;
            const processingJoborder = jbProcComOrders.filter(jb => jb.jobOrderStatus === 'PROCESSING');
            if (processingJoborder.length > 1) {
              obj[this._translateSvc.instant('previous-operation')] = 'MULTIPLE';
              obj[this._translateSvc.instant('current-operation')] = 'MULTIPLE';
              obj[this._translateSvc.instant('current-status')] = processingJoborder[0]?.jobOrderStatus;
              obj[this._translateSvc.instant('next-operation')] = 'MULTIPLE';
            } else if (processingJoborder.length == 1) {
              if (processingJoborder[0]?.jobOrderOperations.length > 1) {
                obj[this._translateSvc.instant('previous-operation')] = 'N/A';
                obj[this._translateSvc.instant('current-operation')] = 'N/A';
                obj[this._translateSvc.instant('current-status')] = 'N/A';
                obj[this._translateSvc.instant('next-operation')] = 'N/A';
              } else {
                const jbIndex = jbProcComOrders.findIndex(jb => jb.jobOrderId === processingJoborder[0].jobOrderId);
                if (jbIndex !== 0) {
                  obj[this._translateSvc.instant('previous-operation')] = jbProcComOrders[jbIndex - 1]?.jobOrderOperations[0]?.operationName;
                } else {
                  obj[this._translateSvc.instant('previous-operation')] = '';
                }
                obj[this._translateSvc.instant('current-operation')] = processingJoborder[0]?.jobOrderOperations[0]?.operationName;
                obj[this._translateSvc.instant('current-status')] = processingJoborder[0]?.jobOrderStatus;
                if (jbIndex !== jbProcComOrders.length) {
                  obj[this._translateSvc.instant('next-operation')] = jbProcComOrders[jbIndex + 1]?.jobOrderOperations[0]?.operationName;
                }
              }
            } else if (processingJoborder.length == 0) {
              const completedJoborders = jbProcComOrders.filter(jb => jb.jobOrderStatus === 'COMPLETED');
              if (completedJoborders.length > 0) {
                obj[this._translateSvc.instant('previous-operation')] = completedJoborders[completedJoborders.length - 1]?.jobOrderOperations[0]?.operationName;
                const jbIndex = jbProcComOrders.findIndex(jb => jb.jobOrderId === completedJoborders[completedJoborders.length - 1]?.jobOrderId);
                if (!(jbIndex >= (jbProcComOrders.length - 1))) {
                  obj[this._translateSvc.instant('current-operation')] = jbProcComOrders[jbIndex + 1]?.jobOrderOperations[0]?.operationName;
                  obj[this._translateSvc.instant('current-status')] = jbProcComOrders[jbIndex + 1]?.jobOrderStatus;
                }
                obj[this._translateSvc.instant('next-operation')] = 'N/A';
              }
            }
            mappedDAta.push(obj);
          }
        }

        this.appStateService.exportAsFile(mappedDAta, 'csv', 'jobOrders');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    });

  }



}
