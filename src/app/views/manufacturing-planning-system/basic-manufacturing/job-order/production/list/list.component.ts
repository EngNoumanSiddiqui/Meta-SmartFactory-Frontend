import { Component, OnInit, OnDestroy, ViewChild, Input, ViewEncapsulation, HostListener } from '@angular/core';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { AppStateService } from 'app/services/dto-services/app-state.service';

import { EnumPOrderStatusService } from 'app/services/dto-services/enum/p-order-status.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ResponseJobOrderFilterDto } from 'app/dto/job-order/job-order.model';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import * as moment from 'moment';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { BookType } from 'xlsx';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductionListComponent implements OnInit, OnDestroy {

  @ViewChild('inspectionLotBSModal') public inspectionLotBSModal: ModalDirective;
  @ViewChild('myProdEditModal') public myProdEditModal: ModalDirective;

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

  pageFilter = {
    // need to provide the prod-order filter
    pageNumber: 1,
    pageSize: 20,
    operationUseName: null,
    jobOrderStatus: null,
    position: null,
    workStationName: null,
    workCenterId: null,
    projectId: null,
    workCenterTypeId: null,
    milestoneId: null,
    milestoneName: null,
    stockUseName: null,
    description: null,
    stockToProduceName: null,
    scheduledStartTime: null,
    scheduledFinishTime: null,
    prodOrderId: null,
    query: null,
    orderByProperty: 'jobOrderId',
    orderByDirection: 'desc',
    materialName: null,
    orderType: null,
    actualFinish: null,
    actualStart: null,
    baseUnit: null,
    batch: null,
    createDate: null,
    finishDate: moment().add(7, 'days').toDate(),
    erpPlannedFinishDate: null,
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
    startDate: new Date(),
    stockName: null,
    stockNo: null,
    toDate: null,
    wareHouseId: null,
    wareHouseName: null,
    priority: null,
    prodOrderStatusList: [],
    prodOrderTypeList: [],
    priorityList: []
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  dialog = {
    visible: false,
    mode: null,
    data: null
  };

  cancelAutoPorders = {
    plantId: null,
    date: null,
  }

  jobOrderStatusList;

  jobOrderPositionList;

  prodOrderStatusList;

  prodOrderTypeList;

  selectedJobOrders = [];

  enableCancelAllBtn: boolean = false;

  modal = { active: false };

  saleModal = { active: false };

  prodTreeModal = { active: false };
  combineProdModal = { active: false, data: null };
  prodEditModal = { active: false, cloned: false, uniqueId: null, data: null, selectedIndex: 'small' };

  inspectionLotModal = { active: false };

  filterWorkcenter = { pageNumber: 1, pageSize: 500, workCenterName: null, workCenterTypeId: null, plantId: null };
  workcenters;
  workcenterTypes;
  selectedWorkCenters = null;
  selectedWorkCenterTypes = null;

  selectedColumns = [
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'prodOrderType', header: 'order-type' },
    { field: 'quantity', header: 'quantity' },
    { field: 'deliveryQuantity', header: 'produced-quantity' },
    { field: 'milestone', header: 'milestone' },
    { field: 'mileStoneRefId', header: 'milestone-refid' },
    { field: 'prodOrderStatus', header: 'status' },
    { field: 'startDate', header: 'planned-start-date' },
    { field: 'finishDate', header: 'planned-finish-date' },
    { field: 'erpPlannedFinishDate', header: 'due-date' },
    { field: 'scheduledStartTime', header: 'scheduled-start-date' },
    { field: 'scheduledFinishTime', header: 'scheduled-finish-date' },
    { field: 'orderDetailId', header: 'sales-order-detail-id' },
  ];

  cols = [
    { field: 'prodOrderId', header: 'prod-order-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'materialName', header: 'material' },
    { field: 'materialNo', header: 'material-number' },
    { field: 'plantName', header: 'plant-name' },
    { field: 'prodOrderType', header: 'order-type' },
    { field: 'prodOrderStatus', header: 'status' },
    { field: 'milestone', header: 'milestone' },
    { field: 'mileStoneRefId', header: 'milestone-refid' },
    { field: 'batch', header: 'batch' },
    { field: 'quantity', header: 'quantity' },
    { field: 'deliveryQuantity', header: 'produced-quantity' },
    { field: 'grQuantity', header: 'GR-Quantity' },
    { field: 'orderUnit', header: 'order-unit' },
    { field: 'baseUnit', header: 'base-unit' },
    { field: 'wareHouseName', header: 'warehouse' },
    { field: 'milestone', header: 'milestone' },
    { field: 'priority', header: 'priority' },
    { field: 'createDate', header: 'create-date' },
    { field: 'startDate', header: 'planned-start-date' },
    { field: 'finishDate', header: 'planned-finish-date' },
    { field: 'erpPlannedFinishDate', header: 'due-date' },
    { field: 'actualStart', header: 'actual-start' },
    { field: 'actualFinish', header: 'actual-finish' },
    { field: 'scheduledStartTime', header: 'scheduled-start-date' },
    { field: 'scheduledFinishTime', header: 'scheduled-finish-date' },
    { field: 'barcode', header: 'barcode' },
    { field: 'locationNo', header: 'location-no' },
    { field: 'orderDetailId', header: 'sales-order-detail-id' },


  ];

  sub: Subscription;

  commonPriorities = [];

  @Input('dashboardStatus') set dStatus(data) {
    if (data && data.type == 'PRODUCTIONORDER') this.ClearDates();
  }

  constructor(private _jobOrderStatusSvc: EnumJobOrderStatusService,
    private _confirmationSvc: ConfirmationService,
    private _jobOrderSvc: JobOrderService,
    private _prodOrderSvc: ProductionOrderService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private _workcenterSvc: WorkcenterService,
    private wcTypesrv: WorkcenterTypeService,
    private enumProdOrderService: EnumPOrderStatusService) {


  }

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


  filter() {
    this.pageFilter.pageNumber = 1;
    this.search();

    setTimeout(() => {
      this.screenHeight();

    }, 50);

  }

  openCloned() {


    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('are-you-sure-you-want-to-clone-with-all-operation'),
      header: this._translateSvc.instant('clone-confirmation'),
      icon: 'fa fa-file',
      accept: () => {
        this.prodEditModal.active = true;
        this.prodEditModal.cloned = true;
        this.prodEditModal.data = this.selectedJobOrders[0];
      },
      reject: () => {
        // this.utilities.showInfoToast('cancelled-operation');
      }
    })
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
    
 if (temp.prodOrderStatusList && temp.prodOrderStatusList.length > 0) {
  temp.prodOrderStatusList = temp.prodOrderStatusList.map(x => x.name);
}

if (temp.prodOrderTypeList && temp.prodOrderTypeList.length > 0) {
  temp.prodOrderTypeList = temp.prodOrderTypeList.map(x => x.name);
}

if (temp.priorityList && temp.priorityList.length > 0) {
  temp.priorityList = temp.priorityList.map(x => x.name);
}
    this.searchTerms.next(temp);
  }

  ClearDates() {
    this.pageFilter.startDate = null;
    this.pageFilter.finishDate = null;
    this.filter();
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
            if (prd.prodOrderStatus == 'REQUESTED') {
              prd.htsStatus = 'WAITING_FINAL_REVIEW';
            } else if (prd.prodOrderStatus == 'READY') {
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
    this.enumProdOrderService.getProdOrderStatusEnum().then(result =>{
      if (result && result.length > 0) {
        this.prodOrderStatusList = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }

    }).catch(error => console.log(error));
    this._jobOrderStatusSvc.getJobOrderPositionList().then(result => this.jobOrderPositionList = result).catch(error => console.log(error));
    this.enumService.getProductionOrderTypeList().then(result =>{
      if (result && result.length > 0) {
        this.prodOrderTypeList = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }

    }).catch(error => console.log(error));
    this.enumService.getCommonPriorityEnum().then((result: any) =>{
      if (result && result.length > 0) {
        this.commonPriorities = result.map(x => {
          let res: any = {};
          res.name = x;
          return res
        });
      }

    }).catch(error => console.log(error));

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantName = null;
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        this.filterWorkcenter.plantId = res.plantId;
        if (this.pageFilter.plantId === 9999) { //INSTEAD OF 91 - ALL HTS CHANGES WILL BE REMOVED
          if (this.selectedColumns.find(itm => itm.field === 'prodOrderStatus')) {
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'prodOrderStatus') + 1, 0, { field: 'htsStatus', header: 'hts-status' })
          } else {
            this.selectedColumns.push({ field: 'htsStatus', header: 'hts-status' })
          }
          this.cols.push({ field: 'htsStatus', header: 'hts-status' })
        } else {
          if (this.selectedColumns.find(itm => itm.field === 'htsStatus')) {
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'htsStatus'), 1);
          }
          if (this.cols.find(itm => itm.field === 'htsStatus')) {
            this.cols.splice(this.cols.findIndex(itm => itm.field === 'htsStatus'), 1);
          }
        }
        this.filter();
        this.filterWorkCenterTypes(res.plantId);
        this.filterWorkCenter();
      }

    });


  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._prodOrderSvc.changeProdOrderStatusToCancel(id).then(() => {
          this.filter();
          this.utilities.showSuccessToast('PRODUCTIONORDER_CHANGED_TO_CANCEL');
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

  turnToReady(id) {
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
    return item !== 'workStationName'
      && item !== 'operationUseName'
      && item !== 'operationNameNext'
      && item !== 'stockToProduceName'
      && item !== 'stockUseName';
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      prodOrderId: null,
      operationUseName: null,
      jobOrderStatus: null,
      erpPlannedFinishDate: null,
      workCenterTypeId: null,
      workStationName: null,
      stockUseName: null,
      description: null,
      workCenterId: null,
      stockToProduceName: null,
      position: null,
      query: null,
      projectId: null,
      milestoneId: null,
      orderByProperty: 'jobOrderId',
      orderByDirection: 'desc',
      materialName: null,
      orderType: null,
      actualFinish: null,
      actualStart: null,
      baseUnit: null,
      batch: null,
      createDate: null,
      finishDate: null,
      milestoneName: null,
      fromDate: null,
      grQuantity: null,
      materialId: null,
      orderDetailId: null,
      orderQuantity: null,
      orderUnit: null,
      plannedQuantity: null,
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
      prodOrderStatus: null,
      prodOrderType: null,
      quantity: null,
      receiptNo: null,
      startDate: null,
      stockName: null,
      scheduledStartTime: null,
      scheduledFinishTime: null,
      stockNo: null,
      toDate: null,
      wareHouseId: null,
      wareHouseName: null,
      priority: null,
      prodOrderStatusList: [],
      prodOrderTypeList: [],
      priorityList: []
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
  showEditProductionOrder(prodOrderId, data) {
    this.prodEditModal.data = data;
    this.prodEditModal.uniqueId = prodOrderId;
    this.prodEditModal.active = true;
  }

  onEditedProdItem(event) {
    if (event === 'close') {
      this.prodEditModal.data = null;
      this.prodEditModal.uniqueId = null;
      this.prodEditModal.active = false;
    } else {

      this.prodEditModal.data = null;
      this.prodEditModal.uniqueId = null;
      this.prodEditModal.active = false;
      this.filter();
    }
  }

  confirmProductionOrder(prodOrder) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-confirm'),
      header: this._translateSvc.instant('ready-confirmation'),
      icon: 'fa fa-check',
      accept: () => {
        const newProductionOrder = JSON.parse(JSON.stringify(prodOrder));
        if (newProductionOrder.jobOrderList) {
          newProductionOrder.jobOrderList.forEach(joborder => {
            if (joborder.reservationList) {
              delete joborder.reservationList;
            }
            if (joborder.prodOrder) {
              joborder.prodOrderId = joborder.prodOrder.prodOrderId;
              delete joborder.prodOrder;
            }
            if (joborder.workStation) {
              joborder.workstationId = joborder.workStation.workStationId;
              joborder.workstationName = joborder.workStation.workStationName;
            }
            if (joborder.productTree) {
              joborder.productTreeId = joborder.productTree.productTreeId;
              delete joborder.productTree;
            }
            if (joborder.productTreeDetail) {
              joborder.productTreeDetailId = joborder.productTreeDetail.productTreeDetailId;
              delete joborder.productTreeDetail;
            }

          });
        }

        if (newProductionOrder['reservationList']) {
          delete newProductionOrder['reservationList'];
        }

        newProductionOrder.prodOrderMaterialList.forEach(prodOrderMaterial => {
          if (!prodOrderMaterial.materialId && prodOrderMaterial['material']) {
            prodOrderMaterial.materialId = prodOrderMaterial['material'].stockId;
            prodOrderMaterial.materialName = prodOrderMaterial['material'].stockName;
            prodOrderMaterial.materialNo = prodOrderMaterial['material'].stockNo;
          }
        });


        newProductionOrder.prodOrderStatus = 'CONFIRMED';
        this._prodOrderSvc.update(newProductionOrder).then(result => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('confirm-success');
          if (this.prodEditModal.active) {
            this.prodEditModal.active = false;
          }
          this.filter();
        }).catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        });

      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });

  }

  makeFinalReview(prodOrder) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-make-it-final-review'),
      header: this._translateSvc.instant('ready-confirmation'),
      icon: 'fa fa-check',
      accept: () => {
        const newProductionOrder = JSON.parse(JSON.stringify(prodOrder));
        if (newProductionOrder.jobOrderList) {
          newProductionOrder.jobOrderList.forEach(joborder => {
            if (joborder.reservationList) {
              delete joborder.reservationList;
            }
            if (joborder.prodOrder) {
              joborder.prodOrderId = joborder.prodOrder.prodOrderId;
              delete joborder.prodOrder;
            }
            if (joborder.workStation) {
              joborder.workstationId = joborder.workStation.workStationId;
              joborder.workstationName = joborder.workStation.workStationName;
            }
            if (joborder.productTree) {
              joborder.productTreeId = joborder.productTree.productTreeId;
              delete joborder.productTree;
            }
            if (joborder.productTreeDetail) {
              joborder.productTreeDetailId = joborder.productTreeDetail.productTreeDetailId;
              delete joborder.productTreeDetail;
            }

          });
        }
        if (newProductionOrder.prodOrderMaterialList) {
          newProductionOrder.prodOrderMaterialList.forEach(prodOrderMaterial => {
            if (!prodOrderMaterial.materialId && prodOrderMaterial['material']) {
              prodOrderMaterial.materialId = prodOrderMaterial['material'].stockId;
              prodOrderMaterial.materialName = prodOrderMaterial['material'].stockName;
              prodOrderMaterial.materialNo = prodOrderMaterial['material'].stockNo;
            }
          });
        }
        if (newProductionOrder['reservationList']) {
          delete newProductionOrder['reservationList'];
        }
        newProductionOrder.prodOrderStatus = 'WAITING_FINAL_REVIEW';
        this._prodOrderSvc.update(newProductionOrder).then(result => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('success');
          this.filter();
        }).catch(error => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        });

      },
      reject: () => {
        // this.utilities.showInfoToast('cancelled-operation');
      }
    });
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

  showMilestoneDetail(milestoneId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.MILESTONE, milestoneId);
  }

  openCreateInspectionLot() {
    this.inspectionLotModal.active = true;
  }

  showOrderDetailDialog(orderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, orderId);
  }

  onSaveSuccessful(event, modal) {
    this.filter();
  }

  saveCombineOrderModal() {
    if (this.prodEditModal?.data?.prodOrderStatus === 'WAITING_FINAL_REVIEW') {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('do-you-want-to-save-without-changes-in-job-order-operations'),
        header: this._translateSvc.instant('save-confirmation'),
        icon: 'fa fa-save',
        accept: () => {
          this._prodOrderSvc.saveEventFire.next('saveEvent');
        },
        reject: () => {

        }
      })
    } else {
      this._prodOrderSvc.saveEventFire.next('saveEvent');
    }
  }
  completeReviewModal() {
    this._prodOrderSvc.saveCompleteEventFire.next('saveEvent');
  }

  myUploader(event, form) {
    const formData = new FormData();
    formData.append('fileToUpload ', event.files[0], event.files[0].name);
    this.loaderService.showLoader();
    this._prodOrderSvc.uploadJobOrderMedia(formData, this.pageFilter.plantId).then(res => {
      form.clear();
      this.utilities.showSuccessToast('file-uploaded');
      this.filter();
    }).catch(error => {
      form.clear();
      this.utilities.showErrorToast('error-occurs');
    })

  }
  myProductionOrderUploader(event, form) {
    const formData = new FormData();
    formData.append('fileToUpload ', event.files[0], event.files[0].name);
    this.loaderService.showLoader();
    this._prodOrderSvc.uploadProdOrderMedia(formData, this.pageFilter.plantId).then(res => {
      form.clear();
      this.utilities.showSuccessToast('file-uploaded');
      this.filter();
    }).catch(error => {
      form.clear();
      this.utilities.showErrorToast('error-occurs');
    })

  }

  cancelAllAutoAndReorderPO() {
    this.dialog.mode = 'cancel-all-porders';
    this.dialog.visible = true;
    const now = new Date();
    now.setDate(now.getDate() - now.getDay() + 7 + 0); // 0=sun, 1=mon
    // next week of sunday
    now.setDate(now.getDate() - now.getDay() + 7 + 0); // 0=sun, 1=mon
    this.cancelAutoPorders.date = ConvertUtil.date2EndOfDay(now);
  }

  cancelAutoPOs() {
    this.cancelAutoPorders.plantId = this.pageFilter.plantId;
    this.cancelAutoPorders.date = ConvertUtil.date2EndOfDay(this.cancelAutoPorders.date);
    this.cancelAutoPorders.date = ConvertUtil.localDateShiftAsUTC(this.cancelAutoPorders.date);
    this.loaderService.showLoader();
    this._prodOrderSvc.cancelAutoProdOrder(this.cancelAutoPorders).then(res => {
      this.filter();
      this.utilities.showSuccessToast('auto-prod-orders-cancelled');
      this.dialog.visible = false;
      this.dialog.mode = null;
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    })
  }
  CreateProductionOrderBSDOnStock() {
    this.loaderService.showLoader();
    this._prodOrderSvc.createProdOrderBaseOnStockStrategy(this.pageFilter.plantId).then(res => {
      this.filter();
      this.utilities.showSuccessToast('prod-orders-created');
      this.dialog.visible = false;
      this.dialog.mode = null;
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    })
  }

  onRowSelect(event) {

    const selectedJobOrders = this.selectedJobOrders.filter(item => item.prodOrderStatus === 'PLANNED' ||
      item.prodOrderStatus === 'READY' || item.prodOrderStatus === 'PROCESSING' ||
      item.prodOrderStatus === 'REQUESTED' || item.prodOrderStatus === 'CONFIRMED');
    console.log('@selectedJobOrders', selectedJobOrders);
    if (selectedJobOrders.length >= 2) {
      this.enableCancelAllBtn = true;
    } else {
      this.enableCancelAllBtn = false;
    }

  }

  OnTableChecked(event) {
    this.onRowSelect(event);
  }

  onRowUnselect(event) {
    this.onRowSelect(event);
  }

  cancelAll() {

    const selectedJobOrders = this.selectedJobOrders.filter(item => item.prodOrderStatus === 'PLANNED' ||
      item.prodOrderStatus === 'READY' || item.prodOrderStatus === 'PROCESSING' ||
      item.prodOrderStatus === 'REQUESTED' || item.prodOrderStatus === 'CONFIRMED');

    selectedJobOrders.sort((a, b) => b.prodOrderId - a.prodOrderId);
    const prodOrderIds = selectedJobOrders.map(item => item.prodOrderId);

    this._confirmationSvc.confirm({
      message: this._translateSvc.instant(prodOrderIds.toString() + 'PRODUCTION_ORDER_WILL_BE_CANCELLED') + '\n '
        + this._translateSvc.instant('do-you-want-to-cancel') + ' ?',
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.selectedJobOrders = [];
        this.enableCancelAllBtn = false;
        prodOrderIds.forEach((element, index) => {
          this._prodOrderSvc.changeProdOrderStatusToCancel(element).then(() => {
            if (prodOrderIds.length == index + 1) {
              this.selectedJobOrders = [];
              this.filter();
              this.utilities.showSuccessToast('PRODUCTIONORDER_CHANGED_TO_CANCEL');
            }
          }
          ).catch(err => {
            this.utilities.showErrorToast(err);
          })
        });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }



  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if (selected) {
      const mappedDAta = this.selectedJobOrders.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field === 'prodOrderId') {
            obj[this._translateSvc.instant('prod-order-id')] = itm.prodOrderId;
          } else if (col.field === 'referenceId') {
            obj[this._translateSvc.instant(col.header)] = itm.referenceId;
          } else if (col.field === 'materialNo') {
            obj[this._translateSvc.instant(col.header)] = itm.materialNo;
          } else if (col.field === 'materialName') {
            obj[this._translateSvc.instant(col.header)] = itm.materialName;
          } else if (col.field === 'prodOrderType') {
            obj[this._translateSvc.instant(col.header)] = itm.prodOrderType;
          } else if (col.field === 'quantity') {
            obj[this._translateSvc.instant(col.header)] = itm.quantity;
          } else if (col.field === 'deliveryQuantity') {
            obj[this._translateSvc.instant(col.header)] = itm.deliveryQuantity;
          } else if (col.field === 'milestone') {
            obj[this._translateSvc.instant(col.header)] = itm.milestone;
          } else if (col.field === 'mileStoneRefId') {
            obj[this._translateSvc.instant(col.header)] = itm.mileStoneRefId;
          } else if (col.field === 'prodOrderStatus') {
            obj[this._translateSvc.instant(col.header)] = itm.prodOrderStatus;
          } else if (col.field === 'startDate') {
            obj[this._translateSvc.instant(col.header)] = itm.startDate ? new Date(itm.startDate).toLocaleString() : '';
          } else if (col.field === 'finishDate') {
            obj[this._translateSvc.instant(col.header)] = itm.finishDate ? new Date(itm.finishDate).toLocaleString() : '';
          } else if (col.field === 'erpPlannedFinishDate') {
            obj[this._translateSvc.instant(col.header)] = itm.erpPlannedFinishDate ? new Date(itm.erpPlannedFinishDate).toLocaleString() : '';
          } else if (col.field === 'scheduledStartTime') {
            obj[this._translateSvc.instant(col.header)] = itm.scheduledStartTime ? new Date(itm.scheduledStartTime).toLocaleString() : '';
          } else if (col.field === 'scheduledFinishTime') {
            obj[this._translateSvc.instant(col.header)] = itm.scheduledFinishTime ? new Date(itm.scheduledFinishTime).toLocaleString() : '';
          } else if (col.field === 'orderDetailId') {
            obj[this._translateSvc.instant(col.header)] = itm.orderDetailId;
          } else if (col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
          }

          else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'prodOrders');
    } else {
      this.loaderService.showLoader();
      this._prodOrderSvc.filter({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field === 'prodOrderId') {
                obj[this._translateSvc.instant('prod-order-id')] = itm.prodOrderId;
              } else if (col.field === 'referenceId') {
                obj[this._translateSvc.instant(col.header)] = itm.referenceId;
              } else if (col.field === 'materialNo') {
                obj[this._translateSvc.instant(col.header)] = itm.materialNo;
              } else if (col.field === 'materialName') {
                obj[this._translateSvc.instant(col.header)] = itm.materialName;
              } else if (col.field === 'prodOrderType') {
                obj[this._translateSvc.instant(col.header)] = itm.prodOrderType;
              } else if (col.field === 'quantity') {
                obj[this._translateSvc.instant(col.header)] = itm.quantity;
              } else if (col.field === 'deliveryQuantity') {
                obj[this._translateSvc.instant(col.header)] = itm.deliveryQuantity;
              } else if (col.field === 'milestone') {
                obj[this._translateSvc.instant(col.header)] = itm.milestone;
              } else if (col.field === 'mileStoneRefId') {
                obj[this._translateSvc.instant(col.header)] = itm.mileStoneRefId;
              } else if (col.field === 'prodOrderStatus') {
                obj[this._translateSvc.instant(col.header)] = itm.prodOrderStatus;
              } else if (col.field === 'startDate') {
                obj[this._translateSvc.instant(col.header)] = itm.startDate ? new Date(itm.startDate).toLocaleString() : '';
              } else if (col.field === 'finishDate') {
                obj[this._translateSvc.instant(col.header)] = itm.finishDate ? new Date(itm.finishDate).toLocaleString() : '';
              } else if (col.field === 'erpPlannedFinishDate') {
                obj[this._translateSvc.instant(col.header)] = itm.erpPlannedFinishDate ? new Date(itm.erpPlannedFinishDate).toLocaleString() : '';
              } else if (col.field === 'scheduledStartTime') {
                obj[this._translateSvc.instant(col.header)] = itm.scheduledStartTime ? new Date(itm.scheduledStartTime).toLocaleString() : '';
              } else if (col.field === 'scheduledFinishTime') {
                obj[this._translateSvc.instant(col.header)] = itm.scheduledFinishTime ? new Date(itm.scheduledFinishTime).toLocaleString() : '';
              } else if (col.field === 'orderDetailId') {
                obj[this._translateSvc.instant(col.header)] = itm.orderDetailId;
              } else if (col.field === 'createDate') {
                obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
              }

              else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateService.exportAsFile(mappedDAta, type, 'prodOrders');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }

  close() {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('are-you-sure-to-close-without-saving-job-order-changes'),
      header: this._translateSvc.instant('back-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.myProdEditModal.hide();
      },
      reject: () => {
      }
    })
  }

}
