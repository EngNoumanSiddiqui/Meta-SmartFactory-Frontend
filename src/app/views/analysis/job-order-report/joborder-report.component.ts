import {Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {ResponseJobOrderReportDto} from '../../../dto/analysis/daily-report/job-order-report';
import {JobOrderService} from '../../../services/dto-services/job-order/job-order.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {DialogTypeEnum} from '../../../services/shared/dialog-types.enum';
import {environment} from '../../../../environments/environment';

import {ConvertUtil} from '../../../util/convert-util';
import {EnumJobOrderStatusService} from '../../../services/dto-services/enum/job-order-status.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { JobOrderOperation } from 'app/dto/porder/porder.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng';
import { BookType } from 'xlsx';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'joborder-report',
  templateUrl: './joborder-report.component.html',
  styleUrls: ['./joborder-report.component.css'],
})
export class JobOrderReportComponent implements OnInit, OnDestroy, OnChanges {
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
    jobOrderStatus: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    jobOrderOperationId: null
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

  empSummaryReportModal = {
    active: false,
  };

  panel = {visible: false, data: null, title: null};

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
    {orderNo: 1,field: 'jobOrderId', header: 'job-order-id'},
    {orderNo: 2,field: 'referenceId', header: 'reference-id'},
    {orderNo: 3,field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {orderNo: 4,field: 'operationName', header: 'operation'},
    {orderNo: 5,field: 'stockToProduceNo', header: 'material-no'},
    {orderNo: 6,field: 'stockToProduceName', header: 'material-name'},
    {orderNo: 7,field: 'totalDuration', header: 'planned-duration'},
    {orderNo: 8,field: 'jobOrderActualStartDate', header: 'actual-start'},
    {orderNo: 9,field: 'jobOrderActualFinishDate', header: 'actual-finish'},
    {orderNo: 10,field: 'productNormalQuantity', header: 'produced-quantity'},
    {orderNo: 11,field: 'workstationName', header: 'workstation'},
    {orderNo: 12, field: 'jobWaitingTime', header: 'job-waiting-time'},
    {orderNo: 13,field: 'netWorkingTime', header: 'net-working-time'},
    {orderNo: 14,field: 'capacityEfficiency', header: 'capacity-efficiency'},
    {orderNo: 16,field: 'jobOrderStatus', header: 'status'}
  ];

  cols = [
    {orderNo: 1, field: 'jobOrderId', header: 'job-order-id'},
    {orderNo: 2, field: 'referenceId', header: 'reference-id'},
    {orderNo: 3, field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {orderNo: 4, field: 'operationName', header: 'operation'},
    {orderNo: 5, field: 'stockToProduceNo', header: 'material-no'},
    {orderNo: 6, field: 'stockToProduceName', header: 'material-name'},
    {orderNo: 7, field: 'totalDuration', header: 'planned-duration'},
    {orderNo: 8, field: 'jobOrderActualStartDate', header: 'actual-start'},
    {orderNo: 9, field: 'jobOrderActualFinishDate', header: 'actual-finish'},
    {orderNo: 10, field: 'productNormalQuantity', header: 'produced-quantity'},
    {orderNo: 11, field: 'workstationName', header: 'workstation'},
    {orderNo: 12, field: 'jobWaitingTime', header: 'job-waiting-time'},
    {orderNo: 13, field: 'netWorkingTime', header: 'net-working-time'},
    {orderNo: 14, field: 'capacityEfficiency', header: 'capacity-efficiency'},
    {orderNo: 15, field: 'programmingDuration', header: 'programming-duration'},
    {orderNo: 16, field: 'jobOrderStatus', header: 'status'}
  ];

  empSummaryReports = [];
  selectedEmpSummaryReports = [];
  selectedEmpSummaryColumns = [
    {field: 'employeeFullName', header: 'employee'},
    {field: 'employeeId', header: 'employee-id'},
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'goodQuantity', header: 'good-quantity'},
    {field: 'reworkQuantity', header: 'rework-quantity'},
    {field: 'scrapQuantity', header: 'scrap-quantity'},
    {field: 'loginDate', header: 'login-date'},
    {field: 'logoutDate', header: 'logout-date'},
    {field: 'onSchedule', header: 'schedule'},
    {field: 'plannedWork', header: 'planned-work'},
    {field: 'actualWork', header: 'actual-work'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'plannedStop', header: 'planned-stop'},
    {field: 'unPlannedStop', header: 'unplanned-stop'}
  ];

  empSummarycols = [
    {field: 'employeeFullName', header: 'employee'},
    {field: 'employeeId', header: 'employee-id'},
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'loginDate', header: 'login-date'},
    {field: 'logoutDate', header: 'logout-date'},
    {field: 'actualWork', header: 'actual-work'},
    {field: 'plannedWork', header: 'planned-work'},
    {field: 'onSchedule', header: 'schedule'},
    {field: 'goodQuantity', header: 'good-quantity'},
    {field: 'scrapQuantity', header: 'scrap-quantity'},
    {field: 'reworkQuantity', header: 'rework-quantity'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'plannedStop', header: 'planned-stop'},
    {field: 'unPlannedStop', header: 'unplanned-stop'},
    // {field: 'workstationId', header: 'workstation-id'},
    {field: 'mulfunction', header: 'malfunction'},
    {field: 'rangeStart', header: 'range-start'},
    {field: 'rangeFinish', header: 'range-finish'},
    {field: 'jobOrderDuration', header: 'job-duration'},
    {field: 'jobOrderStop', header: 'job-stop'},
    {field: 'jobOrderPlannedStop', header: 'job-planned-stop'},
    {field: 'jobOrderUnPlannedStop', header: 'job-unplanned-stop'},
  ];

  stopReasonCols = [
    {field: 'stopCauseName', header: 'stop-cause-name'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'stopPercentage', header: 'stop-percentage'},
  ]


  plantId: any;
  private searchTerm = new Subject<any>();
  selectedJobOrderOperation: any;


  constructor(private jobOrderService: JobOrderService,
              private _jobOrderStatusSvc: EnumJobOrderStatusService,
              private appStateService: AppStateService,
              private employeeService: EmployeeService,
              private _translateSvc: TranslateService,
              private datePipe: DatePipe,
              private utilities: UtilitiesService, private loaderService: LoaderService) {

  }


  ngOnInit() {
    // this.pageFilter.startDate = new Date(ConvertUtil.getPreviousDate(new Date(), 5));
    // this.pageFilter.finishDate = new Date();
    this._jobOrderStatusSvc.getJobOrderEnumList().then(result => this.jobOrderStatusList = result).catch(error => console.log(error));

    this.searchTerm.pipe(
      debounceTime(400),
      switchMap(term => this.jobOrderService.filterJobOrderReport(term))).subscribe(
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
      const mappedDAta = this.selectedJobOrders.map(itm => {
        const obj = {};
        this.cols.forEach(col => {
          if(col.field === 'jobOrderActualStartDate') {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';;
          } else  if(col.field === 'jobOrderActualFinishDate') {
            obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';;
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
      this.jobOrderService.filterJobOrderReport({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const jobOrderReports = result['content'] || [];
        this.normalizeValues(jobOrderReports);
        const mappedDAta = jobOrderReports.map(itm => {
          const obj = {};
          this.cols.forEach(col => {
            if(col.field === 'jobOrderActualStartDate') {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';;
            } else  if(col.field === 'jobOrderActualFinishDate') {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? this.datePipe.transform(new Date (itm[col.field]), 'dd/MM/yyyy HH:mm') : '';;
            } else if(itm.hasOwnProperty(col.field)) {
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

  normalizeValuesEmpSummary(res: any[]) {
    // const empMap = new Map(this.selectedEmployees.map(em => [em.employeeId, em.firstName + ' ' + em.lastName]));
    res.forEach(item => {
      // item.employeeName = '' + empMap.get(item.employeeId);
      item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
      item.actualWork = ConvertUtil.longDuration2DHHMMSSTime(item.actualWork);
      item.plannedWork = ConvertUtil.longDuration2DHHMMSSTime(item.plannedWork);

      item.onSchedule = (item.onSchedule * 100 ).toFixed(2);
      item.plannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.plannedStop);
      item.jobOrderDuration = ConvertUtil.longDuration2DHHMMSSTime(item.jobOrderDuration);
      item.unPlannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.unPlannedStop);
      item.jobOrderPlannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.jobOrderPlannedStop);
      item.jobOrderUnPlannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.jobOrderUnPlannedStop);
    });
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
      jobOrderStatus: null,
      query: null,
      orderByProperty: 'jobOrderId',
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


  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }
  showOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, id);
  }
  showWorkstationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }
  showShiftDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, id);
  }
  showEmployeeDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, id);
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
  }
  showEmployeeReportDetail(rowData) {
    this.loaderService.showLoader();
    this.employeeService.getEmployeesummaryForJobOrderOperationReport(rowData.jobOrderOperationId)
    .then((res:any) => {
      this.loaderService.hideLoader();
      this.empSummaryReports = res;
      this.normalizeValuesEmpSummary(this.empSummaryReports);
      this.empSummaryReportModal.active = true;
    }).catch(er =>{
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(er);
    })
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

  OpenStopDetails(rowData) {
    this.panel.title = 'stop-reason-details';
    this.panel.data = JSON.parse(JSON.stringify(rowData.employeeStopReasonList));
    this.panel.data.forEach(item => {
      item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
    });
    this.panel.visible = true;
  }

  OnHide() {
    this.panel = {visible: false, data: null, title: null};
  }
}
