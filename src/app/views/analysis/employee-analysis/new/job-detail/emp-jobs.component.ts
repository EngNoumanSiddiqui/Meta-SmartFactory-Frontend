import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../../util/convert-util';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {EmployeeService} from '../../../../../services/dto-services/employee/employee.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {AppStateService} from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { MenuItem } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { BookType } from 'xlsx/types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'emp-analysis-jobs',
  templateUrl: './emp-jobs.component.html'
})
export class EmployeeAnalysisJobsComponent implements OnInit, OnDestroy {

  filterInput;

  selectedEmployees = [];
  panel = {visible: false, data: null, title: null};

  @Input('selectedEmployes') set emp(selectedEmps) {
    if(selectedEmps) {
      this.selectedEmployees = selectedEmps;
    }
  }

  @Input('employeList') set employeList(employeList) {
    if(employeList) {
      this.employeeReportPageFilter.employeeList = employeList;
    }
  }

  @Input('jobOrderId') set jobOrderId(jobOrderId) {
    if(jobOrderId) {
      this.employeeReportPageFilter.jobOrderId = jobOrderId;

      this.selectedColumns = this.selectedColumnsForModal;
    }
  }

  @Input('filterInput') set filterModel(filterModel) {
    this.filterInput = filterModel;
    if (filterModel && this.initialized) {
      this.employeeReportPageFilter = Object.assign(this.employeeReportPageFilter, filterModel);
      this.filter(this.employeeReportPageFilter);
    } else {
      this.employeeReportDetailList = [];
    }

  }

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

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  employeeReportPageFilter = {
    pageNumber: 1,
    pageSize: 999999,
    employeeList: [],
    rangeStartDate: null,
    rangeFinishDate: null,
    query: null,
    jobOrderId: null,
    orderByProperty: 'reportDay',
    orderByDirection: 'desc'
  };

  selectedColumnsForModal = [
 
    {field: 'employeeId', header: 'employee-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'operationName', header: 'operation'},
    {field: 'goodQuantity', header: 'goods'},
    {field: 'actualWork', header: 'actual-work'},
    {field: 'loginDate', header: 'login-date'},
    {field: 'logoutDate', header: 'logout-date'}
  ];

  selectedColumns = [
    {field: 'employeeName', header: 'employee'},
    {field: 'employeeId', header: 'employee-id'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'jobOrderId', header: 'job-order-id'},
    {field: 'jobOrderStatus', header: 'job-order-status'},
    {field: 'jobOrderOperationId', header: 'job-order-operation'},
    {field: 'operationName', header: 'operation'},
    {field: 'loginDate', header: 'login-date'},
    {field: 'logoutDate', header: 'logout-date'},
    {field: 'singleTotalDuration', header: 'planned-total-duration'},
    {field: 'plannedWork', header: 'planned-work'},
    {field: 'actualWork', header: 'actual-work'},
    {field: 'onSchedule', header: 'on-schedule'},
    {field: 'goodQuantity', header: 'goods'},
    {field: 'scrapQuantity', header: 'scrap'},
    {field: 'reworkQuantity', header: 'rework'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'plannedStop', header: 'planned-stop'},
    {field: 'unPlannedStop', header: 'unplanned-stop'},
    {field: 'workStationName', header: 'workstation'}

  ];

  cols = [
    {field: 'orderNo', header: 'order-no'},
    {field: 'employeeName', header: 'employee'},
    {field: 'employeeId', header: 'employee-id'},
    {field: 'jobOrderId', header: 'job-order'},
    {field: 'jobOrderOperationId', header: 'job-order-operation'},
    {field: 'operationNo', header: 'operation-no'},
    {field: 'operationName', header: 'operation'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'loginDate', header: 'login-date'},
    {field: 'logoutDate', header: 'logout-date'},
    {field: 'actualWork', header: 'actual-work'},
    {field: 'plannedWork', header: 'planned-work'},
    {field: 'onSchedule', header: 'on-schedule'},
    {field: 'goodQuantity', header: 'goods'},
    {field: 'scrapQuantity', header: 'scrap'},
    {field: 'reworkQuantity', header: 'rework'},
    {field: 'singleTotalDuration', header: 'planned-total-duration'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'plannedStop', header: 'planned-stop'},
    {field: 'unPlannedStop', header: 'unplanned-stop'},
    {field: 'workstationId', header: 'workstation-id'},
    {field: 'mulfunction', header: 'malfunction'},
    {field: 'rangeStart', header: 'range-start'},
    {field: 'rangeFinish', header: 'range-finish'},
    {field: 'jobOrderStatus', header: 'job-order-status'},
    {field: 'jobOrderDuration', header: 'job-duration'},
    {field: 'jobOrderStop', header: 'job-stop'},
    {field: 'jobOrderPlannedStop', header: 'job-planned-stop'},
    {field: 'jobOrderUnPlannedStop', header: 'job-unplanned-stop'},
    {field: 'programmingDuration', header: 'programming-duration'},
    {field: 'workStationName', header: 'workstation'}
  ];

  

  stopReasonCols = [
    {field: 'stopCauseName', header: 'stop-cause-name'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'stopPercentage', header: 'stop-percentage'},
  ]

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  firstLoad = true;
  private searchTermsDetail = new Subject<any>();

  public employeeReportDetailList: Array<any> = [];
  public pagedEmployeeReportDetailList: Array<any> = [];
  selectedRows = [];

  constructor(
    private loaderService: LoaderService,
    private _employeeSvc: EmployeeService,
    private _translateSvc: TranslateService,
    private appStateService: AppStateService,
    private datePipe: DatePipe,
    private utilities: UtilitiesService) {


  }

  initialized;

  ngOnInit() {
    this.initialized = true;
    this.searchTermsDetail.pipe(
      debounceTime(400),
      switchMap(term => this._employeeSvc.getEmployeeLoginSummaryReportDetail(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        // this.pagination.currentPage = result['currentPage'];
        // this.pagination.totalElements = result['totalElements'];
        // this.pagination.totalPages = result['totalPages'];
        this.employeeReportDetailList = result as [];
        this.normalizeValues(this.employeeReportDetailList);
        this.setTableColumns(this.employeeReportDetailList);



        const from = Math.min( ( this.pagination.currentPage - 1 ) * this.pagination.pageSize, this.employeeReportDetailList.length );
        const to   = Math.min( from + this.pagination.pageSize, this.employeeReportDetailList.length );
        this.pagination.totalPages = Math.ceil( this.employeeReportDetailList.length / this.pagination.pageSize );
        this.pagedEmployeeReportDetailList = this.employeeReportDetailList.slice( from, to );

      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.employeeReportDetailList = [];
      }
    );
    this.employeeReportPageFilter = Object.assign(this.employeeReportPageFilter, this.filterInput);
    this.filter(this.employeeReportPageFilter);
  }

  ngOnDestroy() {
  }

  showJobOrderDetail(jobOrderData) {
    // this.dialog.data = jobOrderData;
    // this.dialog.visible = true;
    // this.dialog.mode = 'jobOrderDetails';
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderData);
  }

  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }

  showWorkstationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }

  showOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATION, id);
  }

  filter(data) {
    this.employeeReportPageFilter.pageNumber = 1;
    this.getEmployeeReportDetail(data);
  }

  getEmployeeReportDetail(data) {
    this.loaderService.showLoader();
    this.searchTermsDetail.next(data);
  }

  reOrderData(id, item: string) {

    this.employeeReportPageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.employeeReportPageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.employeeReportPageFilter);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.employeeReportPageFilter[field] = value;

    this.filter(this.employeeReportPageFilter);
  }
  showEmployeeModal(employeeId) {
    if(employeeId)
      this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, employeeId);
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

    this.employeeReportPageFilter.pageNumber = this.pagination.pageNumber;
    this.employeeReportPageFilter.pageSize = this.pagination.pageSize;
    this.employeeReportPageFilter.query = this.pagination.tag;


    // Change data to page number
    const from = Math.min( ( this.pagination.currentPage - 1 ) * this.pagination.pageSize, this.employeeReportDetailList.length );
    const to   = Math.min( from + this.pagination.pageSize, this.employeeReportDetailList.length );
    this.pagination.totalPages = Math.ceil( this.employeeReportDetailList.length / this.pagination.pageSize );
    this.pagedEmployeeReportDetailList = this.employeeReportDetailList.slice( from, to );
  }


  private setTableColumns(eDetailList: Array<any>) {
    let isAllEmployeeNameColumnNull = true;
    for (let i = 0; i < eDetailList.length; i++) {
      if (eDetailList[i].employeeName) {
        isAllEmployeeNameColumnNull = false;
      }
    }
    if (isAllEmployeeNameColumnNull) {
      this.selectedColumns = this.selectedColumns.filter(item => item.field !== 'employeeName')
    } else {

      if (this.selectedColumns.findIndex(item => item.field === 'employeeName') === -1) {
        this.selectedColumns = [{field: 'employeeName', header: 'employee'}, ...this.selectedColumns];
      }
    }
    return;
  }


  seconds2Min(seconds) {
    if (seconds) {
      return seconds / 60;
    }
    return 0;
  }

  normalizeValues(res:any[]) {
    const empMap = new Map(this.selectedEmployees.map(em => [em.employeeId, em.firstName + ' ' + em.lastName]));
    this.pagination.currentPage = 1;
    this.pagination.totalElements = res.length;
    this.pagination.totalPages = 1;
    const me = this;
    this.employeeReportDetailList.forEach(item => {
      item.employeeName = '' + (empMap.get(item.employeeId) ? empMap.get(item.employeeId) : '') ;
      item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
      item.actualWork = ConvertUtil.longDuration2DHHMMSSTime(item.actualWork);
      item.programmingDuration = ConvertUtil.longDuration2DHHMMSSTime(item.programmingDuration);
      item.plannedWork = ConvertUtil.longDuration2DHHMMSSTime(item.plannedWork);
      item.goodQuantity = ConvertUtil.fixIfFracted(item.goodQuantity, 2);
      item.onSchedule = this.getPercentage(item.onSchedule);
      //item.onSchedule = (item.onSchedule * 100 ).toFixed(2);
      item.plannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.plannedStop);
      item.jobOrderDuration = ConvertUtil.longDuration2DHHMMSSTime(item.jobOrderDuration);
      item.unPlannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.unPlannedStop);
      item.jobOrderPlannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.jobOrderPlannedStop);
      item.jobOrderUnPlannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.jobOrderUnPlannedStop);
    });
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2) + '%';
    }
    return '';
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  OpenStopDetails(rowData) {
    this.panel.title = 'stop-reason-details';
    this.panel.data = JSON.parse(JSON.stringify(rowData.employeeStopReasonList));
    this.panel.data.forEach(item => {
      item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
    });
    this.panel.visible = true;
  }

  OpenPlannedDetails(rowData) {
    this.panel.title = 'stop-reason-details';
    this.panel.data = JSON.parse(JSON.stringify(rowData.employeeStopReasonList.filter(itm => itm.planned === true)));
    this.panel.data.forEach(item => {
      item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
    });
    this.panel.visible = true;
  }
  OpenUplannedDetails(rowData) {
    this.panel.title = 'stop-reason-details';
    this.panel.data = JSON.parse(JSON.stringify(rowData.employeeStopReasonList.filter(itm => itm.planned === false)));
    this.panel.data.forEach(item => {
      item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
    });
    this.panel.visible = true;
  }


  OnHide() {
    this.panel = {visible: false, data: null, title: null};
  }


  exportCSV(selected: boolean = false, type:BookType) {
    if(selected) {
      const mappedDAta = this.employeeReportDetailList.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field=="reportDay") {
            obj[this._translateSvc.instant(col.header)] = itm.reportDay? this.datePipe.transform(new Date(itm.reportDay), 'dd/MM/yyyy HH:mm'): '';
          } else if(col.field=="rangeStart") {
            obj[this._translateSvc.instant(col.header)] = itm.rangeStart? this.datePipe.transform(new Date (itm.rangeStart), 'dd/MM/yyyy HH:mm'): '';
          } else if(col.field=="rangeFinish") {
            obj[this._translateSvc.instant(col.header)] = itm.rangeFinish? this.datePipe.transform(new Date (itm.rangeFinish), 'dd/MM/yyyy HH:mm'): '';
          }  else if(col.field=="loginDate") {
            obj[this._translateSvc.instant(col.header)] = itm.loginDate? this.datePipe.transform(new Date (itm.loginDate), 'dd/MM/yyyy HH:mm'): '';
          }  else if(col.field=="logoutDate") {
            obj[this._translateSvc.instant(col.header)] = itm.logoutDate? this.datePipe.transform(new Date (itm.logoutDate), 'dd/MM/yyyy HH:mm'): '';
          } else if(col.field=="singleTotalDuration") {
            obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.singleTotalDuration);
          } else if(itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Employee Efficiency Job Details');
    } else {
      this.loaderService.showLoader();
      this._employeeSvc.getEmployeeLoginSummaryReportDetail({...this.employeeReportPageFilter, pageNumber: 1, pageSize: 99999}) 
      .then((result: any) => {
        this.employeeReportDetailList = result as [];
        this.normalizeValues(this.employeeReportDetailList);
        this.setTableColumns(this.employeeReportDetailList);
        const mappedDAta = this.employeeReportDetailList.map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field=="reportDay") {
              obj[this._translateSvc.instant(col.header)] = itm.reportDay? this.datePipe.transform(new Date(itm.reportDay), 'dd/MM/yyyy HH:mm'): '';
            } else if(col.field=="rangeStart") {
              obj[this._translateSvc.instant(col.header)] = itm.rangeStart? this.datePipe.transform(new Date (itm.rangeStart), 'dd/MM/yyyy HH:mm'): '';
            } else if(col.field=="rangeFinish") {
              obj[this._translateSvc.instant(col.header)] = itm.rangeFinish? this.datePipe.transform(new Date (itm.rangeFinish), 'dd/MM/yyyy HH:mm'): '';
            }  else if(col.field=="loginDate") {
              obj[this._translateSvc.instant(col.header)] = itm.loginDate? this.datePipe.transform(new Date (itm.loginDate), 'dd/MM/yyyy HH:mm'): '';
            }  else if(col.field=="logoutDate") {
              obj[this._translateSvc.instant(col.header)] = itm.logoutDate? this.datePipe.transform(new Date (itm.logoutDate), 'dd/MM/yyyy HH:mm'): '';
            } else if(col.field=="singleTotalDuration") {
              obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.singleTotalDuration);
            } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.loaderService.hideLoader();
        this.appStateService.exportAsFile(mappedDAta, type, 'Employee Efficiency Job Details');
      })
      .catch(error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
    }
  }

}
