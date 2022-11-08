import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ResponseJobOrderDetailDto } from 'app/dto/job-order/job-order.model';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ConvertUtil } from 'app/util/convert-util';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import {CommonTemplateTypeEnum, RequestPrintDto} from '../../../../../dto/print/print.model';
import {UsersService} from '../../../../../services/users/users.service';
import { TabView } from 'primeng';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'job-order-detail',
  templateUrl: './job-order-detail.component.html',
  styleUrls: ['./job-order-detail.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class JobOrderDetailComponent implements OnInit {

  @Output() hideDialog = new EventEmitter<string>();
  @ViewChild('jobOrderTabView') jobOrderTabView: TabView;
  jobDetail: any;
  showLoader = false;
  showCancelled = false;
  jobOrderId = 0;
  reservationList = [];
  fullReservationList= [];
  employeeList = [];
  selectedReservationRow: any;
  modal = {active: false};
  editModal = {active: false};
  panel = {title: null, visible: false, data:null};
  reqChangeJobOrderOperationStatusDto = {
    finishDate: null,
    jobOrderOperationId: null,
    startDate: null
  };
  empWrkOperationModal ={ active: null};

  shiftList = [];
  selectedShift = null;
  filteredShift: any[];
  calculateProgrammingDuration = false;
  empWrkOperatorDto = {
    activeWorking: null,
    actualFinishTime: null,
    actualStartTime: null,
    employeeId: null,
    jobOrderOperationId: null,
    loginWithRFID: null,
    password: null,
    programmingDuration: null,
    shiftId: null,
    workStationOperatorId: null,
    workstationId: null,
  }


  jobOperationIds = [];
  inputStockTransferNotificationDetailList = [];
  currentEmployee: any = null;
  currentShift: any;
  totalElements: number;
  finishDate: Date;
  startDate: Date;
  onceOpened = false;
  @Input('extraData') set setextraData(extraData) {
    if(extraData) {
      // if(extraData.employees) {
      //   this.employeeList = extraData.employees;
      // }
    }
  }
  // @Output() hideDialog = new EventEmitter();

  @Input('jobOrderId') set jobOrder(jobOrderId) {
    if (jobOrderId) {
      // if(this.jobOrderTabView) {
      //   this.jobOrderTabView.tabs[0].selected = true;
      // }
      this.jobOrderId = jobOrderId;
      this.initialize(jobOrderId);
    } else {
      this.jobOrderId = null;
      this.jobDetail = null;
    }
  }
  @Input('jobOrderData') set jobOrderData(jobOrderData) {
    if (jobOrderData) {
      const result = JSON.parse(JSON.stringify(jobOrderData));
      this.jobDetail = result as ResponseJobOrderDetailDto;
      if (this.jobDetail.productionType && typeof(this.jobDetail.productionType) === 'object') {
        this.jobDetail.productionType = this.jobDetail.productionType.message;
      }

      if(this.jobDetail.stockTransferNotificationDetailList){
        this.jobDetail.stockTransferNotificationDetailList.forEach(element => {
          element.quantity = parseInt(element.quantity + '').toFixed(1);
        });
      }

      this.loaderService.hideLoader();
      this.fullReservationList = this.jobDetail.stockReservationList;
      if(this.showCancelled) {
        this.reservationList = this.fullReservationList;
      } else {
        this.reservationList = this.fullReservationList.filter(res => res.latestReservationStatus !== "CANCELLED");
      }
      this.inputStockTransferNotificationDetailList = [];
      if(this.reservationList) {
        this.reservationList.forEach(reservation => {
          if(reservation.stockTransferNotificationDetailList) {
            reservation.stockTransferNotificationDetailList.forEach(notification => {
              notification.quantity = parseInt(notification.quantity + '').toFixed(1);
              this.inputStockTransferNotificationDetailList.push(notification);
            });
          }
        });
      }

      // this.shiftBasedStockReportPageFilter.jobOrderId = this.jobDetail.jobOrderId;
      // this.shiftBasedStockReportPageFilter.startDate = new Date();
      this.finishDate = this.jobDetail.finishDate? new Date(this.jobDetail.finishDate): new Date(this.jobDetail.jobOrderOperations[0]?.erpPlannedFinishDate);
      // this.filtershiftBasedStockReport(this.shiftBasedStockReportPageFilter);


      // if (this.jobDetail.stockTransferNotificationDetailList) {
      //   const treeData = JSON.parse(JSON.stringify(this.jobDetail.stockTransferNotificationDetailList));
      //   this.notificationTree =  treeData.map(itm => ({
      //     label: null,
      //     data: {...itm},
      //     expanded : true,
      //     children: [
      //       {
      //         label: itm.stockTransferNotificationDetailId,
      //         data: null,
      //         expanded : true,
      //         children: [
      //           {
      //             label: itm.stockTransferNotificationDetailId,
      //             data: {...itm},
      //             expanded : true
      //           }
      //         ]
      //       }

      //     ]
      //   }));
      // }
      // if (this.jobDetail.palletList) {
      //   const treeData = JSON.parse(JSON.stringify(this.jobDetail.palletList));
      //   this.palletListTree =  treeData.map(itm => ({
      //     label: itm.palletId,
      //     data: null,
      //     expanded : true,
      //     children: [
      //       {
      //         label: null,
      //         data: {...itm},
      //         expanded : true,
      //       }
      //     ]
      //   }));
      // }
    } else {
      this.jobDetail = null;
    }
  }
  requestPrintDto: RequestPrintDto = new RequestPrintDto();
  printComponent = {active: false};
  reservationSelectedColumns = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    // { field: 'status', header: 'status' },
    // { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'materialName', header: 'material' },
    { field: 'warehouseFromName', header: 'warehouse-from' },
    { field: 'warehouseName', header: 'warehouse' },
    { field: 'locationNo', header: 'location' },
    { field: 'barcode', header: 'barcode' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'deliveredQuantity', header: 'delivered-quantity' },
    { field: 'withdrawnQuantity', header: 'withdrawn-quantity' },
    { field: 'waitingForJobQuantity', header: 'reserved-job-order-quantity' },
    { field: 'waitingForJobOrderOperationId', header: 'reserved-job-order-operation-id' },
    // { field: 'baseUnitMeasure', header: 'base-unit-measure' },
    { field: 'purchaseOrderDetailId', header: 'purchase-order-detail' },
    { field: 'latestReservationStatus', header: 'stock-reservation-status' },
    { field: 'orderDetailstatus', header: 'order-detail-status' },
    { field: 'purcahseOrderDetailstatus', header: 'purchase-order-detail-status' },
    { field: 'movementType', header: 'movement-type' },

    { field: 'jobOrderStatus', header: 'job-order-status' },
    { field: 'prodOrderStatus', header: 'prod-order-status' },

    // { field: 'movementType', header: 'movement-type' }
  ];
  reservationCols = [
    { field: 'reservationId', header: 'reservation-number' },
    { field: 'itemNo', header: 'item-no' },
    { field: 'status', header: 'status' },
    { field: 'finalIssue', header: 'final-issue' },
    { field: 'materialName', header: 'material' },
    { field: 'plantName', header: 'plant' },
    { field: 'batch', header: 'batch' },
    { field: 'requirementDate', header: 'requirement-date' },
    { field: 'requirementQuantity', header: 'requirement-quantity' },
    { field: 'withdrawnQuantity', header: 'withdrawn-quantity' },
    { field: 'waitingForJobQuantity', header: 'reserved-job-order-quantity' },
    { field: 'waitingForJobOrderOperationId', header: 'reserved-job-order-operation-id' },
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
  palletSelectedColumns = [
    { field: 'palletId', header: 'pallet-id'},
    { field: 'goodQuantity', header: 'good-quantity'},
    { field: 'scrapQuantity', header: 'scrap-quantity'},
    { field: 'reworkQuantity', header: 'rework-quantity'},
    // { field: 'cycleQuantity', header: 'cycle-quantity'},
    { field: 'unit', header: 'unit'},
    { field: 'palletStatus', header: 'pallet-status'}
  ];
  palletColumns = [
    { field: 'palletId', header: 'pallet-id'},
    { field: 'goodQuantity', header: 'good-quantity'},
    { field: 'scrapQuantity', header: 'scrap-quantity'},
    { field: 'reworkQuantity', header: 'rework-quantity'},
    { field: 'cycleQuantity', header: 'cycle-quantity'},
    { field: 'createDate', header: 'create-date'},
    { field: 'updateDate', header: 'update-date'},
    { field: 'palletStatus', header: 'pallet-status'},
    { field: 'jobOrder', header: 'job-order-name'},
    { field: 'stock', header: 'stock'},
    { field: 'wareHouse', header: 'warehouse'},
    { field: 'batch', header: 'batch'},
  ]

  employeelistSelectedColumns = [
    { field: 'employeeId', header: 'employee-id'},
    { field: 'employeeName', header: 'first-name'},
    { field: 'employeeLastName', header: 'last-name'},
    { field: 'shift', header: 'shift-id'},
    { field: 'workStation', header: 'workstation'},
    { field: 'programmingDuration', header: 'programming-duration'},
    { field: 'actualStartTime', header: 'actual-start'},
    { field: 'actualFinishTime', header: 'actual-finish'},
  ];
  employeelistColumns = [
    { field: 'employeeId', header: 'employee-id'},
    { field: 'employeeName', header: 'name'},
    { field: 'employeeLastName', header: 'last-name'},
    { field: 'shift', header: 'shift-id'},
    { field: 'workStation', header: 'workstation'},
    { field: 'programmingDuration', header: 'programming-duration'},
    { field: 'actualStartTime', header: 'actual-start'},
    { field: 'actualFinishTime', header: 'actual-finish'},
    { field: 'workStationOperatorId', header: 'worstation-operator-id'},
    { field: 'loginWithRFID', header: 'login-with-rfid'},
    { field: 'activeWorking', header: 'active-working'},
  ];

  notificationSelectedColumns = [
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'materialName', header: 'material-name'},
    { field: 'wareHouseFromName', header: 'warehouse-from'},
    { field: 'wareHouseToName', header: 'warehouse-to'},
    { field: 'quantity', header: 'qt'},
    { field: 'baseUnit', header: 'unit'},
    { field: 'goodMovementDocumentType', header: 'document-type'},
    { field: 'goodsMovementActivityType', header: 'activity-type'},
    { field: 'dispatchingStatusEnum', header: 'dispatching-status'},
    { field: 'goodsMovementStatus', header: 'notification-status'},
  ];
  notificationColumns = [
    { field: 'stockTransferNotificationDetailId', header: 'stock-transfer-notification-detail-id'},
    { field: 'stockTransferReceiptNotificationId', header: 'stock-transfer-receipt-notification-id'},
    { field: 'materialId', header: 'material-id'},
    { field: 'materialName', header: 'material-name'},
    { field: 'materialNo', header: 'material-no'},
    { field: 'plantId', header: 'plant-id'},
    { field: 'plantName', header: 'plant-name'},
    { field: 'wareHouseToId', header: 'warehouse-to-id'},
    { field: 'employee', header: 'employee'},
    { field: 'pemployeeName', header: 'pemployee-name'},
    { field: 'wareHouseToName', header: 'warehouse-to'},
    { field: 'wareHouseFromId', header: 'warehouse-from-id'},
    { field: 'wareHouseFromName', header: 'warehouse-from'},
    { field: 'batch', header: 'batch'},
    { field: 'batchFrom', header: 'batch-from'},
    { field: 'palletRequest', header: 'pallet-request'},
    { field: 'baseUnit', header: 'base-unit'},
    { field: 'quantity', header: 'quantity'},
    { field: 'defected', header: 'defected'},
    { field: 'itemNo', header: 'item-no'},
    { field: 'documentDate', header: 'document-date'},
    { field: 'postingDate', header: 'posting-date'},
    { field: 'documentNo', header: 'document-no'},
    { field: 'actId', header: 'act-id'},
    { field: 'actName', header: 'act-name'},
    { field: 'goodsMovementStatus', header: 'notification-status'},
    { field: 'goodMovementDocumentType', header: 'document-type'},
    { field: 'description', header: 'description'},
    { field: 'goodsMovementActivityType', header: 'activity-type'},
    { field: 'responseStockTransferNotificationDetailList', header: 'response-stock-transfer-notification-detail-list'},
    { field: 'saleOrderId', header: 'sale-order-id'},
    { field: 'prodOrderId', header: 'prod-order-id'},
    { field: 'purchaseOrderId', header: 'purchase-order-id'},
    { field: 'saleOrderNo', header: 'sale-order-no'},
    { field: 'purchaseOrderNo', header: 'purchase-order-no'},
    { field: 'prodOrderNo', header: 'prod-order-no'},
    { field: 'createDate', header: 'create-date'},
    { field: 'pallet', header: 'pallet'},
    { field: 'dispatchingStatusEnum', header: 'dispatching-status'},
  ];

  workstationComponentList= [];

  workstationComponentFilter = {
    jobOrderId: null,
    notificationDetailId: null,
    orderByDirection: 'desc',
    orderByProperty: 'jobOrderId',
    pageNumber: 1,
    pageSize: 200,
    query: null,
    stockId: null,
    workStationComponentId: null,
    workStationId: null
  }
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

  employeeFilter = {
    "jobOrderId": 35991,
    "orderByDirection": "desc",
    "orderByProperty": "workStationOperatorId",
    "pageNumber": 1,
    "pageSize": 99999,
    "plantId": null
  };

  selectedPlant: any;

  // notificationTree: any;
  // palletListTree: any;


  // Trend Chart
  showWeekly = true;
  showDaily = false;
  showMonthly= false;
  trendForShiftProdJobStockWarehouseShiftReportData: any;

  constructor(
     private _jobOrderSvc: JobOrderService,
     private utilities: UtilitiesService,
     private shiftService: ShiftSettingsService,
     private loaderService: LoaderService,
     private dateFormatPipe: DatePipe,
     private _empSvc: EmployeeService,
     private _workstationSvc: WorkstationService,
     private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    this.employeeFilter.plantId = this.selectedPlant.plantId;
    // this.shiftBasedStockReportPageFilter.plantId = this.selectedPlant.plantId;
  }

  showDetail(jobOrderId) {
    this.initialize(jobOrderId);
  }

  onShowCancelledChanged(event) {
    if(this.showCancelled) {
      this.reservationList = this.fullReservationList;
    } else {
      this.reservationList = this.fullReservationList.filter(res => res.latestReservationStatus !== "CANCELLED");
    }
  }


  public initialize(jobOrderId) {
    this.loaderService.showLoader();
    this.onceOpened = true;
    this._jobOrderSvc.getDetail(jobOrderId)
      .then(result => {
        this.jobDetail = result as ResponseJobOrderDetailDto;

        if (this.jobDetail.productionType && typeof(this.jobDetail.productionType) === 'object') {
          this.jobDetail.productionType = this.jobDetail.productionType.message;
        }
        this.jobOperationIds = this.jobDetail.jobOrderOperations.map(item => item.jobOrderOperationId);
        if(this.jobDetail.jobOrderId){
          this.workstationComponentFilter.jobOrderId = this.jobDetail.jobOrderId;
          this.getWorkstationComponentLists();
          this.employeeFilter.jobOrderId = this.jobDetail.jobOrderId;
          this.filterWorstationOperator();
        }
        this.loaderService.hideLoader();
        this.fullReservationList = this.jobDetail.stockReservationList;
        if(this.showCancelled) {
          this.reservationList = this.fullReservationList;
        } else {
          this.reservationList = this.fullReservationList.filter(res => res.latestReservationStatus !== "CANCELLED");
        }

        // console.log('@jobDetail', this.jobDetail)
        if(this.jobDetail.minimumDetayTime) {
          this.jobDetail.minimumDetayTime = ConvertUtil.longDuration2DHHMMSSTime(this.jobDetail.minimumDetayTime);
        }

        this.inputStockTransferNotificationDetailList = [];
        if(this.reservationList) {
          this.reservationList.forEach(reservation => {
            if(reservation.stockTransferNotificationDetailList) {
              reservation.stockTransferNotificationDetailList.forEach(notification => {
                this.inputStockTransferNotificationDetailList.push(notification);
              });
            }
          });
        }

        if(!this.onceOpened) {
          setTimeout(() => {
            this.jobOrderTabView.tabs.forEach(tab => {
              if(tab.selected) {
                tab.selected = false;
              }
            });
            this.jobOrderTabView.tabs[0].selected = true;
          }, 700);
        }



        // this.shiftBasedStockReportPageFilter.jobOrderId = this.jobDetail.jobOrderId;
        this.startDate = this.jobDetail.startDate? new Date(this.jobDetail.startDate): new Date(this.jobDetail.jobOrderOperations[0]?.erpPlannedStartDate);
        this.finishDate = this.jobDetail.finishDate? new Date(this.jobDetail.finishDate): new Date(this.jobDetail.jobOrderOperations[0]?.erpPlannedFinishDate);

        if(!this.startDate) {
          this.startDate = null;
        }
        if(!this.finishDate) {
          this.finishDate = new Date();
        }

        // this.filtershiftBasedStockReport(this.shiftBasedStockReportPageFilter);

        // if(this.jobDetail.minimumDetayTime <= 60000 && this.jobDetail.minimumDetayTime > 0){
        //   this.jobDetail.minimumDetayTime = this.jobDetail.minimumDetayTime /1000 + ' sec';
        // }else if(this.jobDetail.minimumDetayTime > 60000 && this.jobDetail.minimumDetayTime < 3600000){
        //   this.jobDetail.minimumDetayTime = moment(this.jobDetail.minimumDetayTime).minute() + ' min ' + moment(this.jobDetail.minimumDetayTime).seconds() + ' sec';
        // }else if(this.jobDetail.minimumDetayTime >= 3600000){
        //   this.jobDetail.minimumDetayTime = moment(this.jobDetail.minimumDetayTime).hour() + ' h ' + moment(this.jobDetail.minimumDetayTime).minute() + ' min ' + moment(this.jobDetail.minimumDetayTime).seconds() + ' sec';
        // }

        // if (this.jobDetail.stockTransferNotificationDetailList) {
        //   const treeData = JSON.parse(JSON.stringify(this.jobDetail.stockTransferNotificationDetailList));
        //   this.notificationTree =  treeData.map(itm => ({
        //     label: null,
        //     data: {...itm},
        //     expanded : true,
        //     children: [
        //       {
        //         label: itm.stockTransferNotificationDetailId,
        //         data: null,
        //         expanded : true,
        //         children: [
        //           {
        //             label: itm.stockTransferNotificationDetailId,
        //             expanded : true,
        //             data: {...itm}
        //           }
        //         ]
        //       }

        //     ]
        //   }));
        // }
        // if (this.jobDetail.palletList) {
        //   const treeData = JSON.parse(JSON.stringify(this.jobDetail.palletList));
        //   this.palletListTree =  treeData.map(itm => ({
        //     label: itm.palletId,
        //     data: null,
        //     expanded : true,
        //     children: [
        //       {
        //         label: null,
        //         data: {...itm},
        //         expanded : true,
        //       }
        //     ]
        //   }));
        // }
      })
      .catch(error => {
        this.jobDetail = null;
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
  }

  ngOnInit() {
    if(this.selectedPlant) {
      this.shiftService.getShiftSettingsListByPlantId(this.selectedPlant.plantId).then((res: any) => {
        this.shiftList = res;
      });
      this.shiftService.getShiftByPlantAndCurrentDate(this.selectedPlant?.plantId).then((res: any) => {
        this.currentShift = res;
        this.selectedShift = {...this.currentShift};
      }).catch(err =>  console.log(err));

    }


    this._empSvc.getProfileDetail()
    .then((result:any) => {
      if (result) {
        this.currentEmployee = result;
      }
    }).catch(error => console.log(error));

  }






  getWorkstationComponentLists(){
      this._workstationSvc.getWorkstationComponentList(this.workstationComponentFilter).then(res => {
        if(res['content']){
          this.workstationComponentList = res['content'];
        }
      })
  }


  filterWorstationOperator(){
    const filterdto = Object.assign({}, this.workstationComponentFilter);
    filterdto.orderByProperty = 'workStationOperatorId';
    filterdto.orderByDirection = 'desc';
    this._workstationSvc.filterWorstationOperator(filterdto).then(res => {
      if(res['content']){
        this.employeeList = res['content'];
        // this.employeeList.forEach(item => {
        //   if(item.programmingDuration) {
        //     item.programmingDuration = ConvertUtil.longDuration2DHHMMSSTime(item.programmingDuration);
        //   }
        // });
      }
    })
}


getReadable = (duration) => {
  if(duration) {
    return ConvertUtil.longDuration2DHHMMSSTime(duration);
  }

  return '';
}

  isLoading() {
    return this.loaderService.isLoading();
  }



  closeDialog() {
    this.loaderService.hideDetailDialog(DialogTypeEnum.JOBORDER);
    this.hideDialog.emit('true');
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

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time)
  }

  getPrintHtmlDocument() {
    // this.requestPrintDto.templateId = 5;
    this.requestPrintDto.templateTypeCode = CommonTemplateTypeEnum.JOB_ORDER;
    this.requestPrintDto.plantId = this.selectedPlant?.plantId;
    this.requestPrintDto.itemId = this.jobOrderId;
    this.printComponent.active = true;
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }
  showPalletDetail(palletId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PALLETRECORD, palletId);
  }

  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }
  showSalesOrderDetail(salesOrderID) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDER, salesOrderID);
  }
  showEmployeeDetail(empId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, empId);
  }
  showShiftDetail(shiftId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, shiftId);
  }
  showOrderDetails(salesDetailID) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, salesDetailID);
  }

  showCustomerDetail(customerId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }
  showBatchDetail(batch) {
    this.loaderService.showDetailDialog(DialogTypeEnum.BATCH, batch);
  }

  showJobORderOperationDetail(operationid) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, operationid);
  }

  showPlantDetail(plant) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plant);
  }

  showOperationDetail(opearationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  showWorkstationDetail(workStationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workStationId);
  }
  showPurchaseOrderDetailItem(purchaseOrderItemId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PURCHASEORDERITEMDETAIL, +purchaseOrderItemId);
  }
  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showReservationDialog(reservationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.RESERVATION, +reservationId);
  }

  showJobOrderDialog(jobOrderId){
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, +jobOrderId);
  }
  showJobOrderOperationDialog(jobOrderId){
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, +jobOrderId);
  }

  showStockTransferReceiptNotificationModal(notificationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.TRANSFERNOTIFICATION, +notificationId);
  }

  showStockTransferReceiptNotificationDetailModal(notificationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.TRANSFERNOTIFICATION, +notificationId);
  }


  showProductionOrderModal(prodId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, +prodId);
  }

  showWarehouseDetail(warehouseId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, +warehouseId);
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
    this.workstationComponentFilter.pageNumber = this.pagination.pageNumber;
    this.workstationComponentFilter.pageSize = this.pagination.pageSize;
    this.workstationComponentFilter.query = this.pagination.tag;
    this.filterWorstationOperator();
  }

  showReservationModal(rowData: any) {
    this.selectedReservationRow = JSON.parse(JSON.stringify(rowData));
    this.modal.active = true;
  }
  showEditReservationModal(rowData: any) {
    this.selectedReservationRow = JSON.parse(JSON.stringify(rowData));
    this.editModal.active = true;
  }

  showSalesOrderDetailItem(purchaseOrderItemId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.ORDERITEM, +purchaseOrderItemId);
  }

  showProdOrderDetail(prodOrderId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, +prodOrderId);
  }


  onShiftChanged(shift) {
    this.empWrkOperatorDto.shiftId = shift.shiftId;
    // const day = ConvertUtil.localDateShiftAsUTC(this.filterModel.day);
    // this.filterChangeData = Object.assign({}, this.filterModel, {day: day});
    // this.selectedShift = shift;
  }

  filterShift(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.shiftList.length; i++) {
      const shift = this.shiftList[i];
      if (shift.shiftName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(shift);
      }
    }
    this.filteredShift = filtered;
  }
  handleDropdownClickForShift() {
    this.filteredShift = [...this.shiftList];
  }


  onJobOperationSelected(event) {
    if(event) {
      this.empWrkOperatorDto.workstationId = this.jobDetail.jobOrderOperations
      .find(x => x.jobOrderOperationId === +this.empWrkOperatorDto.jobOrderOperationId)?.workStationId
      || null;
    }
  }



  modalNewShow(data) {
    this.empWrkOperatorDto = {
      activeWorking: null,
      actualFinishTime: new Date(),
      actualStartTime: null,
      employeeId: this.currentEmployee?.employeeId,
      jobOrderOperationId: this.jobOperationIds[0],
      loginWithRFID: null,
      password: null,
      programmingDuration: null,
      shiftId: this.currentShift?.shiftId,
      workStationOperatorId: null,
      workstationId: this.jobDetail.jobOrderOperations[0].workStationId,
    };
    this.selectedShift = {...this.currentShift};
    this.empWrkOperationModal.active = true;


  }


  modalEditShow(data) {
    this.empWrkOperatorDto = {
      activeWorking: data['activeWorking'],
      actualFinishTime: data['actualFinishTime'] ? new Date(data['actualFinishTime']) : null,
      actualStartTime: data['actualStartTime'] ? new Date(data['actualStartTime']) : null,
      employeeId: data['employee'] ? data['employee']['employeeId'] : this.currentEmployee?.employeeId,
      jobOrderOperationId: data['jobOrderOperationId'] || this.jobOperationIds[0],
      loginWithRFID: data['loginWithRFID'],
      password: data['password'],
      programmingDuration: data['programmingDuration'],
      shiftId: data['shift'] ? data['shift']['shiftId'] : null,
      workStationOperatorId: data['workStationOperatorId'],
      workstationId: data['workStation'] ? data['workStation']['workStationId'] : null,
    };
    this.selectedShift = data.shift || null;
    this.empWrkOperationModal.active = true;
  }

  saveEmpWorkstationOperator() {
    this.loaderService.showLoader();
    this._workstationSvc.updateWorkStationOperator(this.empWrkOperatorDto).then(res => {
      this.loaderService.hideLoader();
      this.empWrkOperationModal.active = false;
      this.filterWorstationOperator();
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err, 'Something went wrong!');
    });
  }

  cancel() {
    this.empWrkOperationModal.active = false;
  }


  onTimeChanged(event) {
    if(this.calculateProgrammingDuration && this.empWrkOperatorDto.actualStartTime && this.empWrkOperatorDto.actualFinishTime) {
      this.empWrkOperatorDto.programmingDuration = this.empWrkOperatorDto.actualFinishTime.getTime() - this.empWrkOperatorDto.actualStartTime.getTime();
    }
  }



}
