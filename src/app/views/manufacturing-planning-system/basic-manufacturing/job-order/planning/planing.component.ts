import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {forkJoin, Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { OperationService} from 'app/services/dto-services/operation/operation.service';
import { ConvertUtil } from 'app/util/convert-util';
import { ConfirmationService, Dialog } from 'primeng';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';
@Component({
  selector: 'job-order-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class JobOrderPlanningComponent implements OnInit, OnDestroy {
  minDateValue = new Date();
  private searchTermsReady = new Subject<any>();
  saveCombineOrder: boolean = false;
  private searchTermsPlanned = new Subject<any>();
  prodOrderTypeList;
  showFullComponents = -10;
  wsPagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 3,
    RowsPerPageOptions: [10, 20, 200, 500],
    rows: 20,
    tag: ''
  };

  readyPagining = {

    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 3,
    RowsPerPageOptions: [5, 10, 20, 200, 500],
    rows: 20,
    tag: ''
  };
  plannedPagining = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 3,
    RowsPerPageOptions: [5, 10, 20, 200, 500],
    rows: 20,
    tag: ''
  };
  readyJobOrders;
  selectedReadyJobOrders;
  workstationsForPlanning;

  loadedJobs;
  orderDetails = [];

  panel = {
    type: null,
    title: null,
    data: null,
    workStationId: null,
    workStationName: null,
    startDate: null,
    employeeId: null,
    employeeName: null,
    visible: false
  };
  reqChangeJobOrderOperationStatusDto = {
    finishDate: null,
    jobOrderOperationId: null,
    startDate: null,
    stockQuantityList: [],
  };
  combineProdModal = {
    active: false,
    data: null,
  };
  selectedJobOrder;
  params = {
    numberOfJobs: null, jobList: [], error: ''
  };

  readyJobsPageFilter = {
    'orderByProperty': 'jobOrderId',
    'orderByDirection': 'desc',
    'query': null,
    plantId: null,
    'pageNumber': 1,
    'pageSize': 20,
    'stockToProduceName': null,
    'operationUseName': null,
    jobOrderOperationId: null,
    referenceId: null,
    prodOrderReferenceId: null,
    orderDetailIdList: [],
    jobOrderId: '',
    jobOrderStatus: null
  };

  emptyfilterReadyJobs = {
    'orderByProperty': 'jobOrderId',
    'orderByDirection': 'desc',
    'query': null,
    plantId: null,
    'pageNumber': 1,
    'pageSize': 20,
    'stockToProduceName': null,
    referenceId: null,
    jobOrderOperationId: null,
    prodOrderReferenceId: null,
    'operationUseName': null,
    orderDetailIdList: [],
    jobOrderId: '',
    jobOrderStatus: null
  };

  plannedJobsPageFilter = {
    'orderByProperty': 'jobOrderId',
    'orderByDirection': 'desc',
    'query': null,
    'pageNumber': 1,
    'pageSize': 20,
    plantId: null,
    'operationUseName': '',
    'workStationName': null,
    'stockToProduceName': null,
    'operationName': null,
    jobOrderOperationId: null,
    startDate: null,
    referenceId: null,
    prodOrderReferenceId: null,
    prodOrderId: null,
    finishDate: null,
    orderDetailIdList: [],
    jobOrderId: ''
  };


  filterWorkStation = {
    pageNumber: 1,
    pageSize: 10,
    workStationName: '',
    plantId: null,
    query: null,
    orderByProperty: '',
    orderByDirection: 'asc',
  };

  @ViewChild('dJoin') dJoin: Dialog;

  cols = [
    {field: 'prodOrderId', header: 'prod-order-id'},
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {field: 'orderDetailId', header: 'order-detail-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'operationUseName', header: 'operation'},
    {field: 'receiptNo', header: 'receipt-no'},
    {field: 'workStationName', header: 'workstation'},
    {field: 'stockToProduceName', header: 'material'},
    {field: 'neededQuantity', header: 'planned-quantity'},
    {field: 'description', header: 'description'},
    {field: 'createDate', header: 'create-date'},
    {field: 'startDate', header: 'planned-start'},
    {field: 'finishDate', header: 'planned-finish'},
    {field: 'stockUseName', header: 'component'},
    {field: 'position', header: 'position'},
    {field: 'jobOrderStatus', header: 'status'}
  ];
  sub: Subscription;
  operationIndex = -1;
  jobOrderOperationIds = [];


  constructor(private _jobOrderSvc: JobOrderService,
    private _prodOrderSvc: ProductionOrderService,
              private _workStationSvc: WorkstationService,
              private loader: LoaderService,
              private utilities: UtilitiesService,
              private _confirmationSvc: ConfirmationService,
              private appStateService: AppStateService,
              private _enumSvc: EnumService,
              private _translateSvc: TranslateService,
              private operationServie: OperationService) {

               

  }


  exportCSV() {
    import("xlsx").then(xlsx => {
      // const exportedjobOrders = selected ? this.selectedJobOrders : this.allJobs;

      const mappedDAta = this.loadedJobs.filter(jb => jb.jobOrderStatus=="PLANNED").map(itm => {
        const obj = {};
        obj[this._translateSvc.instant('prod-order-id')] = itm['prodOrder']?.prodOrderId;
        obj[this._translateSvc.instant('job-order-id')] = itm.jobOrderId;
        obj[this._translateSvc.instant('job-order-operation-id')] = itm.jobOrderOperations.map(op => op.jobOrderOperationId).join();
        obj[this._translateSvc.instant('reference-id')] = itm.referenceId;
        obj[this._translateSvc.instant('operation')] = itm.jobOrderOperations.map(op => op.operationName).join();
        obj[this._translateSvc.instant('input')] = itm.jobOrderOperations.map(op => op.jobOrderStockUseList.map(st => st.stockName).join()).join();
        obj[this._translateSvc.instant('output')] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList.map(st => st.stockName).join()).join();
        obj[this._translateSvc.instant('quantity')] = itm.jobOrderOperations.map(op => op.jobOrderStockProduceList.map(st => st.neededQuantity).join()).join();
        // obj[this._translateSvc.instant('individual-capacity')] = itm.individualCapacity;
        obj[this._translateSvc.instant('workstation')] = itm.jobOrderOperations.map(op => op.workStationName).join();
        obj[this._translateSvc.instant('position')] = itm.position;
        obj[this._translateSvc.instant('status')] = itm.jobOrderStatus;
        obj[this._translateSvc.instant('create-date')] = itm.createDate;
        obj[this._translateSvc.instant('start-date')] = itm.startDate;
        obj[this._translateSvc.instant('finish-date')] = itm.finishDate;
        // obj[this._translateSvc.instant('status')] = itm.jobOrderStatus;
        // obj[this._translateSvc.instant('reference-id')] = itm.referenceId;
        return (obj);
      })
        const worksheet =  xlsx.utils.json_to_sheet(mappedDAta);
        const header = Object.keys(mappedDAta[0]); // columns name
        let wscols = [];
        for (var i = 0; i < header.length; i++) {  // columns length added
          wscols.push({ wch: header[i].length + 210, width: header[i].length + 315, wpx: header[i].length + 215 })
        }
        worksheet["!cols"] = wscols;
        // worksheet["!cols"] = [{ width: 150, wch: 150 }, { wch: 150 }, { wch: 200 },
        //   { wch: 250 }, { wch: 150 }, { wch: 100 }, { wch: 100 }, { wch: 200 }, { wch: 200 } ]; ;
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        const excelBuffer: any = xlsx.write(workbook, { bookType: 'csv', type: 'array' });
        // XLSX.writeFile(wb, "SheetJS.xlsb", {compression:true});
        this.saveAsExcelFile(excelBuffer, "planned_JobOrders");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.csv';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }

    this.readyJobsPageFilter[field] = value;
    this.searchReadyJobs();
  }

  openJoinDialog() {
    if ((this.selectedReadyJobOrders) && this.selectedReadyJobOrders.length > 1) {
      this.combineProdModal.active = true;
      this.combineProdModal.data = this.selectedReadyJobOrders;
    } else {
      this.utilities.showWarningToast('min-select-two');
    }
  }

  reset() {
    this.selectedReadyJobOrders = [];

    this.readyJobsPageFilter = Object.assign({}, this.emptyfilterReadyJobs)

  }

  resetReadyJobs() {
    this.readyJobsPageFilter = Object.assign({}, this.emptyfilterReadyJobs)
    this.searchReadyJobs();
  }

  updateJobOrderStatusToReady(jobOrderId) {
    this._jobOrderSvc.changeJobOrderStatusToReady(jobOrderId).then((res) => {
      this.ngOnInit();
    }).catch(error => this.utilities.showErrorToast(error))
  }

  rollbackStandByJobOrder(jobOrderId) {
    this._jobOrderSvc.rollbackStandByJobOrder(jobOrderId).then((res) => {
      this.ngOnInit();
    }).catch(error => this.utilities.showErrorToast(error))
  }

  searchReadyJobsForOrderDetail(event) {
    if (event && event.length > 0) {
      const orderDetailIdList = event.map(item => {
        if (item.hasOwnProperty('orderDetailId')) {
          return item.orderDetailId;
        }
      });
      this.readyJobsPageFilter.orderDetailIdList = orderDetailIdList;
    } else {
      this.readyJobsPageFilter.orderDetailIdList = null;
    }
    this.searchReadyJobs();
  }

  searchPlannedJobsForOrderDetail(event) {
    if (event && event.length > 0) {
      const orderDetailIdList = event.map(item => {
        if (item.hasOwnProperty('orderDetailId')) {
          return item.orderDetailId;
        }
      });
      this.plannedJobsPageFilter.orderDetailIdList = orderDetailIdList;
    } else {
      this.plannedJobsPageFilter.orderDetailIdList = null;
    }
    this.searchPlannedJobs();
  }

  myChanges(event) {
    this.wsPagination.currentPage = event.currentPage;
    this.wsPagination.pageNumber = event.pageNumber;
    this.wsPagination.totalElements = event.totalElements;
    this.wsPagination.pageSize = event.pageSize;
    this.wsPagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.wsPagination.tag !== event.searchItem) {
      this.wsPagination.pageNumber = 1;
    }
    this.wsPagination.tag = event.searchItem;

    this.filterWorkStation.pageNumber = this.wsPagination.pageNumber;
    this.filterWorkStation.pageSize = this.wsPagination.pageSize;
    this.filterWorkStation.query = this.wsPagination.tag;

    setTimeout(() => {
      this.filterWorkstations()
    }, 200);
  }

  ngOnInit() {
    const me = this;
    this._enumSvc.getProductionOrderTypeList().then(result => {
      this.prodOrderTypeList = result;
    }).catch(error => console.log(error));

    this.searchTermsPlanned.pipe(
      debounceTime(400),
      switchMap(term => me._jobOrderSvc.filterByStatusPlannedOrProcessingObservableVs2(term))).subscribe(
      result => {
        this.plannedPagining.currentPage = result['currentPage'];
        this.plannedPagining.totalElements = result['totalElements'];
        this.plannedPagining.totalPages = result['totalPages'];
        this.loadedJobs = result['content'];
        console.log('@loadedJobs', result['content'])
        this.loader.hideLoader();
      },
      error => {
        this.loadedJobs = [];
        this.loader.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );

    this.searchTermsReady.pipe( debounceTime(400), switchMap(term => me._jobOrderSvc.filterByStatusReadyObservableVs2(term))).subscribe(result => {
        this.loader.hideLoader();

        if (result['content'] && result['content'].length > 0) {
          result['content'].forEach(prodOrder => {
            if (prodOrder.jobOrderOperations) {
              prodOrder.jobOrderOperations.forEach(operation => {
                if (operation.workStationId && operation.workStationName && operation.parent) {
                  operation.workStation = {
                    workStationId: operation.workStationId,
                    workStationName: operation.workStationName
                  }
                }
              });
            }
          });
        }

        this.readyJobOrders = result['content'];
        this.readyPagining.currentPage = result['currentPage'];
        this.readyPagining.totalElements = result['totalElements'];
        this.readyPagining.totalPages = result['totalPages'];


        this.readyJobOrders.forEach(item => {
          if(item.individualCapacity == 0){
            item.individualCapacity = 1;
          }
          if (item.hasOwnProperty('startDate')) {
            item.startDate = null;
          }
          if (item.orderDetailId) {
            const exist = me.orderDetails.find(or => or.value === item.orderDetailId);
            if (!exist) {
              me.orderDetails.push({value: item.orderDetailId, label: item.orderDetailId});
            }
          }

        });

      }, error => {
        this.readyJobOrders = [];
        this.loader.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );

    // this.filterWorkstations();
    // this.initialize();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.readyJobsPageFilter.plantId = null;
        this.plannedJobsPageFilter.plantId = null;
      } else {
        this.readyJobsPageFilter.plantId = res.plantId;
        this.plannedJobsPageFilter.plantId = res.plantId;
        this.filterWorkStation.plantId = res.plantId;
        this.emptyfilterReadyJobs.plantId = res.plantId;
        this.initialize();
      }
      // this.filterWorkstations();
      
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // onChangeIndividualCapacity(individualCapacity,index){
  //   this.readyJobOrders.oper[index].individualCapacity = individualCapacity;
  // }
  initialize() {

    this.searchReadyJobs();
    this.filterPlannedJObs();
  }

  filterPlannedJObs() {
    this.loader.showLoader();
    if(this.plannedJobsPageFilter.jobOrderOperationId) {
      this.plannedJobsPageFilter.jobOrderOperationId = +this.plannedJobsPageFilter.jobOrderOperationId;
    }
    this.searchTermsPlanned.next(this.plannedJobsPageFilter);
  }

  searchReadyJobs() {
    this.readyJobsPageFilter.pageNumber = 1;

    this.filterReadyJObs();
  }

  searchPlannedJobs() {
    this.plannedJobsPageFilter.pageNumber = 1;
    this.filterPlannedJObs();
  }


  filterReadyJObs() {
    this.loader.showLoader();
    if(this.readyJobsPageFilter.jobOrderOperationId) {
      this.readyJobsPageFilter.jobOrderOperationId = +this.readyJobsPageFilter.jobOrderOperationId;
    }
    this.searchTermsReady.next(this.readyJobsPageFilter);
  }


  cancelReadyAllJobOrder() {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-cancel'),
      header: this._translateSvc.instant('cancel-confirmation'),
      icon: 'fa fa-times',
      accept: () => {
        this.loader.showLoader();
        let jobIds = this.selectedReadyJobOrders.map(itm => this._jobOrderSvc.cancelJobOrder(itm.jobOrderId));
        forkJoin([...jobIds]).subscribe(results => {
          this.filterReadyJObs();
          this.loader.hideLoader();
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_CANCEL');
        }, err => {
          this.utilities.showErrorToast(err);
          this.loader.hideLoader();
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
        this.loader.showLoader();
        this._jobOrderSvc.cancelJobOrder(jobOrderId).then(() => {

          this.loader.hideLoader();
          this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_CANCEL');
          this.filterPlannedJObs();
        }
        ).catch(err => {
          this.loader.hideLoader();
          this.utilities.showErrorToast(err);
        })
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  showJobOrderOperationDetail(id) {
    this.loader.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }

  // processToCompleted(rowData) {
  //   this._confirmationSvc.confirm({
  //     message: this._translateSvc.instant('do-you-want-to-complete'),
  //     header: this._translateSvc.instant('complete-confirmation'),
  //     icon: 'fa fa-times',
  //     accept: () => {
  //       this.loader.showLoader();
  //       for (const item of rowData.jobOrderOperations) {
  //         this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = item.jobOrderOperationId;
  //         this.reqChangeJobOrderOperationStatusDto.startDate = new Date(rowData.startDate);
  //         this.reqChangeJobOrderOperationStatusDto.finishDate = new Date(rowData.finishDate);
  //         this._jobOrderSvc.removeProcessingStatusToComplete(this.reqChangeJobOrderOperationStatusDto).then(res => {
  //             this.loader.hideLoader();
  //             this.utilities.showSuccessToast('JOBORDER_CHANGED_TO_COMPLETED');
  //             this.filterPlannedJObs();
  //           }
  //         ).catch(err => {
  //           this.loader.hideLoader();
  //           this.utilities.showErrorToast(err);
  //         })
  //       }
  //     },
  //     reject: () => {
  //       this.utilities.showInfoToast('cancelled-operation');
  //     }
  //   });
  // }


  jobListPageChange(event, paginationObj: any, listType: string) {
    paginationObj.currentPage = event.currentPage;
    paginationObj.pageNumber = event.pageNumber;
    paginationObj.totalElements = event.totalElements;
    paginationObj.pageSize = event.pageSize;
    paginationObj.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (listType === 'ready') {
      this.readyJobsPageFilter.pageNumber = this.readyPagining.pageNumber;
      this.readyJobsPageFilter.pageSize = this.readyPagining.pageSize;
      this.filterReadyJObs();
    } else if (listType === 'planned') {
      this.plannedJobsPageFilter.pageNumber = this.plannedPagining.pageNumber;
      this.plannedJobsPageFilter.pageSize = this.plannedPagining.pageSize;
      this.filterPlannedJObs();
    }
  }

  filterWorkstations() {
    this._workStationSvc.getWorkStationsForJobOrderPlanning(this.filterWorkStation).then(result => {
      this.workstationsForPlanning = result['content'];
      this.wsPagination.currentPage = result['currentPage'];
      this.wsPagination.totalElements = result['totalElements'];
      this.wsPagination.totalPages = result['totalPages'];
    }).catch(error => this.utilities.showErrorToast(error));
  }
  saveCombineOrderModal() {
    this._prodOrderSvc.saveEventFire.next('saveEvent');
  }

  loadJobs() {
    if ((this.selectedReadyJobOrders)) { // Validate first
      this.selectedReadyJobOrders.forEach(item => {
        const readyJobOrder = this.readyJobOrders.find(k => k.jobOrderId === item.jobOrderId);
        if (readyJobOrder) {
          item.startDate = readyJobOrder.startDate;
          item.workStation = readyJobOrder.workStation;
          if (item.workStation) {
            item.workStationId = item.workStation.workStationId;
            item.workStationName = item.workStation.workStationName;
          } else {
            item.workStationId = null;
            item.workStationName = null;
          }
        }
      });

      let isValid = true;
      let message = '';
      let jobOrderOperations = [];

      for (const order of this.selectedReadyJobOrders) {
        let tempMsg = '\n';
        // if (!(order.workStation) || !(order.workStation.workStationId > 0)) {
        //   tempMsg = tempMsg + ' Workstation ';
        //   isValid = false;
        // }
        if (!(order.startDate)) {
          tempMsg = tempMsg + ' Start Date ';
          isValid = false;
        }
        if (!isValid) {
          tempMsg = tempMsg + ' is undefined for jb' + order.jobOrderId;
          isValid = false;
          message = message + tempMsg + '<br/>';
        }
        if(order.jobOrderOperations && order.jobOrderOperations.length > 0){
          order.jobOrderOperations.forEach(element => {
            jobOrderOperations.push(element);
          });
        }
      }

      //if none of operations has a parent: true value, there will be error "Parent Operation is Not Defined"
      if(jobOrderOperations.length > 0){
        let parentOperationWithNoWorkstationExist = jobOrderOperations.find(item =>  item.parent && item.workStation === null);

        if (parentOperationWithNoWorkstationExist) {
          isValid = false;
          message = message + 'Workstation is Not Defined';
        }
      }

      if (isValid) {
        let count = 0;

        for (const order of this.selectedReadyJobOrders) {
          let jobOrderOperations = order.jobOrderOperations;
          let jobOrderOperationId = null;
          let operationWorkstationList = null;
          if (jobOrderOperations && jobOrderOperations.length === 1) {
            jobOrderOperationId = jobOrderOperations[0].jobOrderOperationId;
          } else if (jobOrderOperations && jobOrderOperations.length > 1) {
            const jobOrderOperation = jobOrderOperations.find(item => item.parent === true || item.parent );
            if (jobOrderOperation) {
              jobOrderOperationId = jobOrderOperation.jobOrderOperationId;
            } else {
              // get smallest joborderoperation id
              const operations = jobOrderOperations.sort((a, b) => {
                return a.jobOrderOperationId - b.jobOrderOperationId;
              });
              jobOrderOperationId = operations[0].jobOrderOperationId;
            }
          }

          if (jobOrderOperations && jobOrderOperations.length > 0) {
            // for adding workstation and joborder operation in  operationWorkstationList who has each parent true
            jobOrderOperations.forEach(operation => {
              if (operation.parent) {
                if (operationWorkstationList === null) {
                  operationWorkstationList = [];
                }

                operationWorkstationList.push({
                  workStationId: operation.workStation ? operation.workStation.workStationId : operation.workStationId,
                  jobOrderOperationId: operation.jobOrderOperationId
                });
              }
            });
          }
          const data = {
            individualCapacity: order.individualCapacity,
            jobOrderId: order.jobOrderId,
            jobOrderOperationId: jobOrderOperationId,
            operationWorkstationList: operationWorkstationList,
            prodOrderId: order.prodOrder ? order.prodOrder.prodOrderId: null,
            saleOrderId: null,
            // employeeId: order.employeeId,
            startDate: order.startDate,
            workStationId: order.workStation ? order.workStation.workStationId : (operationWorkstationList ? operationWorkstationList[0].workStationId : null),
            checkIntersection : true
          };
          // console.log('@beforeUpdate', data);return;
          
          this._jobOrderSvc.updateStatusReadyToPlan(data)
            .then(() => {
              count++;
              // if (count === this.selectedReadyJobOrders.length) {
                // this.initialize();
              // }
              this.utilities.showSuccessToast('success-planned');
              this.selectedReadyJobOrders.splice(this.selectedReadyJobOrders.indexOf(order), 1);
              this.initialize();
            })
            .catch(error => {
              count++;
              if (count === this.selectedReadyJobOrders.length) {
                this.initialize();
              }
              this.utilities.showErrorToast(error);

              if (error==="WORKSTATION_BUSY_FOR_SELECTED_PLANNED_DATE") {
              this._confirmationSvc.confirm({
                message: this._translateSvc.instant('are-you-sure-to-plan-with-other-job-orders-at-the-same-time'),
                header: this._translateSvc.instant('save-confirmation'),
                icon: 'fa fa-floppy-o',
                accept: () => {
                  data.checkIntersection = false;
                  setTimeout(() => {
                    this._jobOrderSvc.updateStatusReadyToPlan(data)
                    .then(() => {

                      this.utilities.showSuccessToast('success-planned');
                      this.selectedReadyJobOrders.splice(this.selectedReadyJobOrders.indexOf(order), 1);
                      this.initialize();
                    })
                    .catch(error => {
                     
                      this.utilities.showErrorToast(error);
                    });
                  }, 500);
                },
                reject: () => {
        
                }
              });
            }
            });
        }
      } else {
        this.utilities.showWarningToast(message);
      }

    } else {

      this.utilities.showWarningToast('min-select');

    }
  }

  openDivideDialog() {
    if ((this.selectedReadyJobOrders) && this.selectedReadyJobOrders.length === 1) {
      this.panel.visible = true;
      this.panel.title = 'divide-job-order';
    } else {
      this.utilities.showWarningToast('select-one');
    }
  }


  openPanel(order, type, workStationIndex?: any) {
    console.log('order=======>', order)
    if (type === 'workstation') {
      this.operationServie.getOrderDetail(order.jobOrderOperations[workStationIndex].operationId).then((res: any) => {
        if(res && res.workStationIdList.length) {
          this.workstationsForPlanning = res.workStationIdList;
          this.wsPagination.currentPage = 1;
          this.wsPagination.totalElements = res.workStationIdList.length;
          this.wsPagination.totalPages = 1;
        } else {
          this.filterWorkstations();
        }

      });
    }
    this.panel = {
      type: type,
      title: type,
      data: null,
      workStationId: null,
      workStationName: null,
      startDate: null,
      employeeId: null,
      employeeName: null,
      visible: false
    };
    this.selectedJobOrder = order;
    this.operationIndex = workStationIndex;
  }

  closePanel(data, type) {

    if (type === 'workstation') {
      this.selectedJobOrder.jobOrderOperations[this.operationIndex].workStation = data;
      this.selectedJobOrder.jobOrderOperations[this.operationIndex].workStationId = data.workStationId;
      this.selectedJobOrder.jobOrderOperations[this.operationIndex].workStationName = data.workStationName;
      this.selectedJobOrder.jobOrderOperations[this.operationIndex].startDate = data.finishDate ? new Date(data.finishDate) : null;
      // this.readyJobOrders = [...this.readyJobOrders];
    } else if (type === 'start-date') {
      if (this.panel.startDate !== '') {
        this.selectedJobOrder.startDate = this.panel.startDate;
      }

    }
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
      if (total === this.selectedReadyJobOrders[0].quantity) {
        const data = {jobOrderId: this.selectedReadyJobOrders[0].jobOrderId, quantityList: quantityList};
        this._jobOrderSvc.divideJobOrder(data)
          .then(() => {
            this.utilities.showSuccessToast('success-divided');
            this.panel.visible = false;
            this.reset();
            this.initialize();
          })
          .catch(error => this.utilities.showErrorToast(error));
      } else {
        this.params.error = this._translateSvc.instant('quantity-not-equal');
      }

    } else if (type === 'auto') {
      for (let i = 0; i < this.params.numberOfJobs - 1; i++) {
        total = total + Math.round(this.selectedReadyJobOrders[0].quantity / this.params.numberOfJobs);
        quantityList.push(Math.round(this.selectedReadyJobOrders[0].quantity / this.params.numberOfJobs));
      }
      quantityList[quantityList.length] = this.selectedReadyJobOrders[0].quantity - total;
      const data = {jobOrderId: this.selectedReadyJobOrders[0].jobOrderId, quantityList: quantityList};
      this._jobOrderSvc.divideJobOrder(data)
        .then(() => {
          this.utilities.showSuccessToast('success-divided');
          this.panel.visible = false;
          this.reset();
          this.initialize();
        })
        .catch(error => this.utilities.showErrorToast(error));
    }
  }


  moveToJoinTop() {
    this.dJoin.moveOnTop();
  }


  showJobOrderDetail(jobOrderId) {
    this.loader.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }

  showProdOrderDetail(prodOrderId) {
    this.loader.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
  }

  showStockDetail(stockId) {
    this.loader.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  showOperationDetail(opearationId) {
    this.loader.showDetailDialog(DialogTypeEnum.OPERATION, opearationId);
  }

  showOrderDetail(orderId) {
    this.loader.showDetailDialog(DialogTypeEnum.ORDER, orderId);
  }

  showWorkStationDetail(workStationId) {
    this.loader.showDetailDialog(DialogTypeEnum.WORKSTATION, workStationId);
  }

  joinSaved() {
    this.panel.visible = false;
    this.initialize();
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

  openProcessModal(rowData) {
    this.panel.data = rowData;
    this.panel.title = 'processing-to-planned';
    this.panel.visible = true;
    this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = rowData.jobOrderOperationId;
    this.reqChangeJobOrderOperationStatusDto.startDate = new Date(rowData.startDate);
    this.reqChangeJobOrderOperationStatusDto.finishDate = null;
  }
  openCompleteModal(rowData) {
    this.panel.data = rowData;
    this.jobOrderOperationIds = rowData.jobOrderOperations.map(jbOp => jbOp.jobOrderOperationId);
    this.panel.title = 'complete-job-order';
    this.panel.visible = true;
    // this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = rowData.jobOrderOperationId;
    this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = this.jobOrderOperationIds && this.jobOrderOperationIds.length ? this.jobOrderOperationIds[0] : null;
    this.reqChangeJobOrderOperationStatusDto.startDate = new Date(rowData.startDate);
    this.reqChangeJobOrderOperationStatusDto.finishDate = new Date(rowData.finishDate);
    this.reqChangeJobOrderOperationStatusDto.stockQuantityList = [];
    rowData.jobOrderOperations.forEach(jbOp => {
      if(jbOp.jobOrderStockProduceList && jbOp.jobOrderStockProduceList.length) {
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
    this.loader.showLoader();
    this._jobOrderSvc.removeProcessingStatusToComplete(this.reqChangeJobOrderOperationStatusDto).then(res => {
      this.loader.hideLoader();
      this.panel.visible = false;
      this.panel.title = null;
      this.jobOrderOperationIds = [];
      this.panel.data = null;
      this.filterPlannedJObs();
      this.utilities.showSuccessToast('job-operation-updated');
    }).catch(err => {
      this.loader.hideLoader();
      this.utilities.showErrorToast('error', err);
    });
  }

  processToPlanned() {
    this.loader.showLoader();
    this._jobOrderSvc.removeProcessingStatusToPlanned(this.reqChangeJobOrderOperationStatusDto).then(res => {
      // this.getData(this.filterSchedule);
      this.loader.hideLoader();
      this.panel.visible = false;
      this.panel.title = null;
      this.panel.data = null;
      
      this.filterPlannedJObs();
      this.utilities.showSuccessToast('job-operation-updated');
    }).catch(err => {
      this.loader.hideLoader();
      this.utilities.showErrorToast('error', err);
    });
  }

  getOperationDataHeight(operation){
    var data = {
      height: 0,
      totalHeight: 0
    }
    if(operation.jobOrderStockProduceList.length >  operation.jobOrderStockUseList.length){
      data.height = (operation.jobOrderStockProduceList.length + 1) * 20;
      data.totalHeight =operation.jobOrderStockProduceList.length;
    }else{
      data.height = (operation.jobOrderStockUseList.length + 1) * 20;
      data.totalHeight = operation.jobOrderStockUseList.length;
    }

    return data;
  }

  getFixedValue(val) {
    return ConvertUtil.fix(val, 2)
  }
}
