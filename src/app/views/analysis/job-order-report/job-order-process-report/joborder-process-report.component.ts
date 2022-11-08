import {Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { JobOrderOperation } from 'app/dto/porder/porder.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng';
import { BookType } from 'xlsx';
import { environment } from 'environments/environment';
import { ResponseJobOrderReportDto } from 'app/dto/analysis/daily-report/job-order-report';
import { EnumJobOrderStatusService } from 'app/services/dto-services/enum/job-order-status.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'joborder-process-report',
  templateUrl: './joborder-process-report.component.html',
  styleUrls: ['./joborder-process-report.component.css'],
})
export class JobOrderProcessReportComponent implements OnInit, OnDestroy, OnChanges {
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
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    startDate: ConvertUtil.date2StartOfDay(new Date()),
    finishDate: new Date(),
    workstationId: null,
    customerId: null,
    plantId: null,
    jobOrderId: null,
    prodOrderId: null,
    jobOrderStatus: null,
    query: null,
    orderByProperty: 'referenceId',
    orderByDirection: 'desc',
    jobOrderOperationId: null
  };

  classReOrder = ['asc', 'asc', 'desc'];

  chartModal = {
    active: false,
    data: {
      jobOrderOperationId: null,
      jobOrderId: null,
      prodOrderId: null,
      startDate: null,
      endDate: null
    }
  };

  loginSummaryModal = {
    active : false,
    selectedEmployee: [],
    jobOrderId: null,
    employeeName:  null
  }

  jobOrderStatusList;

  jobOrderReportDto: ResponseJobOrderReportDto[];

  jobOrderOperations: JobOrderOperation[] = [];
  sub: Subscription;
  selectedJobOrder: any;
  selectedWorkstation: any;

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

  @Input('jobOrderFilter') jobOrderFilter = null;

  selectedJobOrders = [];

  selectedColumns = [
    {orderNo: 1,field: 'referenceId', header: 'reference-id'},
    {orderNo: 2,field: 'orderNo', header: 'order-no'},
    {orderNo: 3,field: 'jobOrderId', header: 'job-order-id'},   
    {orderNo: 4,field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {orderNo: 5,field: 'operationName', header: 'operation'},
    {orderNo: 6,field: 'plannedQuantity', header: 'planned-quantity'},  
    {orderNo: 7,field: 'productNormalQuantity', header: 'produced-quantity'},  
    {orderNo: 8,field: 'totalDuration', header: 'planned-duration'},
    {orderNo: 9,field: 'netWorkingTime', header: 'net-working-time'},
    {orderNo: 10,field: 'capacityEfficiency', header: 'capacity-efficiency'},
    {orderNo: 11,field: 'employeeReportName', header: 'employee'},
    {orderNo: 12,field: 'actualWork', header: 'actual-work'},
    {orderNo: 13,field: 'onSchedule', header: 'on-schedule'},
    {orderNo: 14,field: 'goodQuantity', header: 'goods'},
    {orderNo: 15,field: 'jobOrderActualStartDate', header: 'actual-start'},
    {orderNo: 16,field: 'jobOrderActualFinishDate', header: 'actual-finish'},
    {orderNo: 17,field: 'workstationName', header: 'workstation'},
    {orderNo: 18,field: 'programmingDuration', header: 'programming-duration'},
    {orderNo: 19, field: 'jobWaitingTime', header: 'job-waiting-time'},
    {orderNo: 20,field: 'stockToProduceNo', header: 'material-no'},
    {orderNo: 21,field: 'stockToProduceName', header: 'material-name'},
    {orderNo: 22,field: 'jobOrderStatus', header: 'status'},
    {orderNo: 23,field: 'prodOrderId', header: 'production-order-id'}
  ];

  cols = [
    {orderNo: 1,field: 'referenceId', header: 'reference-id'},
    {orderNo: 2,field: 'orderNo', header: 'order-no'},
    {orderNo: 3,field: 'jobOrderId', header: 'job-order-id'},   
    {orderNo: 4,field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {orderNo: 5,field: 'operationName', header: 'operation'},
    {orderNo: 6,field: 'plannedQuantity', header: 'planned-quantity'},  
    {orderNo: 7,field: 'productNormalQuantity', header: 'produced-quantity'},  
    {orderNo: 8,field: 'totalDuration', header: 'planned-duration'},
    {orderNo: 9,field: 'netWorkingTime', header: 'net-working-time'},
    {orderNo: 10,field: 'capacityEfficiency', header: 'capacity-efficiency'},
    {orderNo: 11,field: 'employeeReportName', header: 'employee'},
    {orderNo: 12,field: 'actualWork', header: 'actual-work'},
    {orderNo: 13,field: 'onSchedule', header: 'on-schedule'},
    {orderNo: 14,field: 'goodQuantity', header: 'goods'},
    {orderNo: 15,field: 'jobOrderActualStartDate', header: 'actual-start'},
    {orderNo: 16,field: 'jobOrderActualFinishDate', header: 'actual-finish'},
    {orderNo: 17,field: 'workstationName', header: 'workstation'},
    {orderNo: 18,field: 'programmingDuration', header: 'programming-duration'},
    {orderNo: 19, field: 'jobWaitingTime', header: 'job-waiting-time'},
    {orderNo: 20,field: 'stockToProduceNo', header: 'material-no'},
    {orderNo: 21,field: 'stockToProduceName', header: 'material-name'},
    {orderNo: 22,field: 'jobOrderStatus', header: 'status'},
    {orderNo: 23,field: 'prodOrderId', header: 'production-order-id'},
    {orderNo: 24,field: 'scrapQuantity', header: 'scrap'}
  ];

  plantId: any;
  private searchTerm = new Subject<any>();
  selectedJobOrderOperation: any;


  constructor(private jobOrderService: JobOrderService,
              private _jobOrderStatusSvc: EnumJobOrderStatusService,
              private appStateService: AppStateService,
              private datePipe: DatePipe,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService, private loaderService: LoaderService) {

  }


  ngOnInit() {
    // this.pageFilter.startDate = new Date(ConvertUtil.getPreviousDate(new Date(), 5));
    // this.pageFilter.finishDate = new Date();
    this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));

    this.searchTerm.pipe(
      debounceTime(400),
      switchMap(term => this.jobOrderService.getJobOrderReportWithEmployeeReport(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.jobOrderReportDto = (result['content'] as ResponseJobOrderReportDto[]);
        this.normalizeValues(this.jobOrderReportDto);
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
      },
      err => {
        this.loaderService.hideLoader();
        this.jobOrderReportDto = [];
        this.utilities.showErrorToast(err);
      });



    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plantId = null;
      } else {
        this.plantId = res.plantId;
        this.pageFilter.plantId = this.plantId;
        if(this.pageFilter.startDate && this.pageFilter.finishDate) {
          this.filter();

        }
      }
    });

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges.jobOrderFilter && simpleChanges.jobOrderFilter.currentValue) {
      this.pageFilter.workstationId = simpleChanges.jobOrderFilter.currentValue.filter.workstationId;
      this.pageFilter.startDate = simpleChanges.jobOrderFilter.currentValue.filter.rangeStart;
      this.pageFilter.finishDate = simpleChanges.jobOrderFilter.currentValue.filter.rangeEnd;
      this.pageFilter.jobOrderId = simpleChanges.jobOrderFilter.currentValue.jobOrderId;
      this.pageFilter.prodOrderId = simpleChanges.jobOrderFilter.currentValue.prodOrderId;
      this.pageFilter.jobOrderOperationId = simpleChanges.jobOrderFilter.currentValue.jobOrderOperationId;
      this.jobOrderService.filterJobOrderReport(this.pageFilter).then(
        result => {
          this.loaderService.hideLoader();
          this.jobOrderReportDto = (result['content'] as ResponseJobOrderReportDto[]);
          this.normalizeValues(this.jobOrderReportDto);
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
        })
    }
  }

  filter() {
    this.pageFilter.pageNumber = 1;
    this.refresh();
    this.search();
    
  }

  refresh() {
    this.loaderService.showLoader();
    this.jobOrderService.createLoginSummary(this.pageFilter.plantId).then(res => {
      this.loaderService.hideLoader();
      //this.utilities.showSuccessToast('refreshed');
      // this.filter();
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }
  search() {
    this.firsLoad = false;
    this.loaderService.showLoader();
    // use temp because we dont want to change date field in front end.
    const temp = Object.assign({}, this.pageFilter);
    // const ofset = moment().utcOffset();
    // temp.startDate = moment.utc(this.pageFilter.startDate).startOf('day').toDate();
    // temp.finishDate = moment.utc(this.pageFilter.finishDate).endOf('day').toDate();
    // if (temp.startDate) {
    //   temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
    //   temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    // } if (temp.finishDate) {
    //   temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
    //   temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    // }

    this.searchTerm.next(temp);
  }

  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const transformData = [];
      for (let index = 0; index < this.selectedJobOrders.length; index++) {
        const jobOrder = this.selectedJobOrders[index];
        if(jobOrder.employeeReport && jobOrder.employeeReport.length) {
          jobOrder.employeeReport.forEach(employee => {
            transformData.push({...jobOrder,employeeReport: employee});
          });
        } else {
          transformData.push({...jobOrder,employeeReport: null});
        }
        
      }
      const mappedDAta = transformData.map(itm => {
        const obj = {};
        this.cols.forEach(col => {
          if ( col.field === 'orderNo') {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.formatOrderNo(itm[col.field] ) : '';
          } else if(col.field === 'jobOrderActualStartDate') {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';
          } else  if(col.field === 'jobOrderActualFinishDate') {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';
          } else  if(col.field === 'employeeReportName') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.employeeFullName : '';
          } else  if(col.field === 'actualWork') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.actualWork : '';
          } else  if(col.field === 'goodQuantity') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.goodQuantity : '';
          } else  if(col.field === 'scrapQuantity') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.scrapQuantity : '';
          } else  if(col.field === 'onSchedule') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.onSchedule : '';
          }else  if(col.field === 'employeeReportStartTime') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport && itm.employeeReport.loginDate? this.datePipe.transform(new Date (itm.employeeReport.loginDate), 'dd/MM/yyyy HH:mm'): '';
          }else  if(col.field === 'employeeReportFinishTime') {
            obj[this._translateSvc.instant(col.header)] = itm.employeeReport && itm.employeeReport.logoutDate? this.datePipe.transform(new Date (itm.employeeReport.logoutDate), 'dd/MM/yyyy HH:mm') : '';
          }
          else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'jobOrderReports');
    } else {
      this.loaderService.showLoader();
      this.jobOrderService.getJobOrderReportWithEmployeeReport({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const jobOrderReports = result['content'] || [];
        this.normalizeValues(jobOrderReports);
        const transformData = [];
        for (let index = 0; index < jobOrderReports.length; index++) {
          const jobOrder = jobOrderReports[index];
          if(jobOrder.employeeReport && jobOrder.employeeReport.length) {
            jobOrder.employeeReport.forEach(employee => {
              transformData.push({...jobOrder,employeeReport: employee});
            });
          } else {
            transformData.push({...jobOrder,employeeReport: null});
          }
          
        }
        const mappedDAta = transformData.map(itm => {
          const obj = {};
          this.cols.forEach(col => {
            if(col.field === 'jobOrderActualStartDate') {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';
            } else  if(col.field === 'jobOrderActualFinishDate') {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';
            } else  if(col.field === 'employeeReportName') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.employeeFullName : '';
            } else  if(col.field === 'actualWork') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.actualWork : '';
            }  else  if(col.field === 'goodQuantity') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.goodQuantity : '';
            } else  if(col.field === 'scrapQuantity') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.scrapQuantity : '';
            } else  if(col.field === 'onSchedule') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport? itm.employeeReport.onSchedule : '';
            }else  if(col.field === 'employeeReportStartTime') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport && itm.employeeReport.loginDate? this.datePipe.transform(new Date (itm.employeeReport.loginDate), 'dd/MM/yyyy HH:mm'): '';
            }else  if(col.field === 'employeeReportFinishTime') {
              obj[this._translateSvc.instant(col.header)] = itm.employeeReport && itm.employeeReport.logoutDate? this.datePipe.transform(new Date (itm.employeeReport.logoutDate), 'dd/MM/yyyy HH:mm') : '';
            }
            else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'jobOrderReports');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }


  normalizeValues(res: ResponseJobOrderReportDto[]) {
    const me = this;
    res.map(item => {
      // time come in seconds format so we ned to convert it to milliseconds

      // item.jobOrderActualStartDate = ConvertUtil.localDate2UTC(item.jobOrderActualStartDate);
      item.singleProductCycleTime = me.getReadableTime(item.singleProductCycleTime);
      item.singleProductCycleTimeActual = me.getReadableTime(item.singleProductCycleTimeActual);
      item.netWorkingTime = me.getReadableTime(item.netWorkingTime);
      item.preparingTime = me.getReadableTime(item.preparingTime );
      item.minPreparingTime = me.getReadableTime(item.minPreparingTime );
      item.jobWaitingTime = me.getReadableTime(item.jobWaitingTime );
      item.totalDuration = me.getReadableTime(item.totalDuration );
      item.programmingDuration = me.getReadableTime(item.programmingDuration );
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
    

      item.employeeReport.forEach(empReport => {
        empReport.actualWork = me.getReadableTime(empReport.actualWork);
        empReport.onSchedule = me.getPercentage(empReport.onSchedule);
      })

    });
  }

  onSelectColumns(event) {
    this.selectedColumns.sort((a:any, b: any) => a.orderNo - b.orderNo);
  }

  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.pageFilter.workstationId = event.workStationId;
      this.selectedWorkstation = event;
    } else {
      this.pageFilter.workstationId = null;
      this.selectedWorkstation = null;
    }
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if(field === 'jobOrderOperationId' && value) {
      value = +value;
    }else if(field === 'jobOrderOperationId' && !value){
      this.selectedJobOrderOperation = null;
  }
    if(field === 'jobOrderId' && value) {
      value = +value;
    } else if(field === 'jobOrderId' && !value){
        this.selectedJobOrder= null;
    }

    
    this.pageFilter[field] = value;
    this.filter();
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter();
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      startDate: null,
      finishDate: null,
      workstationId: null,
      plantId: null,
      customerId: null,
      jobOrderId: null,
      prodOrderId: null,
      jobOrderStatus: null,
      query: null,
      orderByProperty: 'referenceId',
      orderByDirection: 'desc',
      jobOrderOperationId: null
    };
    this.filter();
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }


  isLoading() {
    return this.loaderService.isLoading();
  }
  showProdOrderDetail(prodOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, prodOrderId);
  }

  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }
  showOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, id);
  }
  showEmployeeDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
  }
  showWorkstationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }
  

  showStockDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, id);
  }

  showJobOrderReportDetail(rowData) {
    this.chartModal.active = true;
    this.chartModal.data.jobOrderOperationId = rowData.jobOrderOperationId;
    this.chartModal.data.startDate = this.pageFilter.startDate;
    this.chartModal.data.endDate = this.pageFilter.finishDate;
    this.chartModal.data.jobOrderId = rowData.jobOrderId;
    this.chartModal.data.prodOrderId = rowData.prodOrderId;
  }

  showLoginSummary(employeeId, jobOrderId, employeeName) {

    this.loginSummaryModal.selectedEmployee= [];
    this.loginSummaryModal.active = true;

    this.loginSummaryModal.selectedEmployee.push(employeeId);
    this.loginSummaryModal.jobOrderId = jobOrderId;

    this.loginSummaryModal.employeeName= employeeName;


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
      this.search()
    }, 500);
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return '';
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2HHMMSSTime(time)
  }

  setSelectedJobOrder(jobOrder){
    if(jobOrder) {
    // console.log('@setSelectedJobOrder',jobOrder);

    this.pageFilter.jobOrderId = jobOrder.jobOrderId;
    this.pageFilter.jobOrderOperationId = null;
    this.selectedJobOrderOperation = null;
    this.pageFilter.jobOrderOperationId = null;
    this.jobOrderOperations = jobOrder.jobOrderOperations;
    } else {
      this.pageFilter.jobOrderId = null;
      this.selectedJobOrder = null;
      this.selectedJobOrderOperation = null;
      this.jobOrderOperations = [];
      this.pageFilter.jobOrderOperationId = null;
    }
  }

  setSelectedJobOrderOperation(operation){
    console.log('@setSelectedJobOrderOperation', operation)
    if(operation) {
      this.pageFilter.jobOrderOperationId = operation.jobOrderOperationId;
    } else {
      this.pageFilter.jobOrderOperationId = null;
    }
  }
  handleDropDownclick(event) {
    if(this.selectedJobOrder) {
      this.jobOrderOperations = [...this.selectedJobOrder.jobOrderOperations];
    } else {
      this.jobOrderOperations = [];
    }
  }

  formatOrderNo( orderNo: string ): string {
    for ( let i = 0; i < orderNo.length; i = i + 2 ) {
      if ( i > 0 && i < orderNo.length) {
        orderNo = orderNo.substring(0, i) + '.' + orderNo.substring(i);
        i++;
      }
    }
    return orderNo;
  }

}
