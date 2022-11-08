import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { ConvertUtil } from '../../../../util/convert-util';
import { LoaderService } from '../../../../services/shared/loader.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EmployeeService } from '../../../../services/dto-services/employee/employee.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { EmployeeReportDetailDto, EmployeeReportSumDto } from '../../../../dto/analysis/employee/employee-report-dtos';
import { environment } from '../../../../../environments/environment';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { MenuItem, UIChart } from 'primeng';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { TranslateService } from '@ngx-translate/core';
import { BookType } from 'xlsx/types';

@Component({
  selector: 'app-employee-analysis-new',
  templateUrl: './new-employee-analysis.component.html',
  styleUrls: ['./new-employee-analysis.component.scss']
})
export class NewEmployeeAnalysisComponent implements OnInit, OnDestroy {

  barData: any;

  options: any;

  cumulativeBarData: any;

  cumulativeOptions: any;

  workingEffeciencyData: any;
  employeeWorkEfficiencyList: Array<any>;
  cumulativeStopReasonList: Array<any>;
  

  workingEffeciencyOptions: any;
  @ViewChild('TotalWorkEffChart') TotalWorkEffChart: UIChart;
  @ViewChild('CumulativeStopChart') CumulativeStopChart: UIChart;
  @ViewChild('WorkEffChart') WorkEffChart: UIChart;

  filterCon = {
    employeeList: [],
    rangeStartDate: ConvertUtil.date2StartOfDay(new Date()),
    rangeFinishDate: new Date()
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: 999999,
    query: '',
    orderByProperty: '',
    orderByDirection: 'desc',
    plantId: null
  };

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
    orderByProperty: 'reportDay',
    orderByDirection: 'desc',
    jobOrderId: null,
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

  @Input('jobOrderId') set jobOrderId(jobOrderId) {
    if (jobOrderId) {
      this.employeeReportPageFilter.jobOrderId = jobOrderId;

      this.selectedColumns = this.selectedColumnsForModal;
    }
  }
  selectedColumnsForModal = [

    { field: 'employeeId', header: 'employee-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'operationName', header: 'operation' },
    { field: 'goodQuantity', header: 'goods' },
    { field: 'actualWork', header: 'actual-work' },
    { field: 'loginDate', header: 'login-date' },
    { field: 'logoutDate', header: 'logout-date' }
  ];



  selectedColumns = [
    { field: 'employeeName', header: 'employee' },
    { field: 'day', header: 'day' },
    { field: 'shiftName', header: 'shift' },
    // { field: 'actualWorkPercentage', header: 'actual-work-percentage' },
    { field: 'sumOfActualWork', header: 'actual-work' },
    { field: 'sumOfPlannedWork', header: 'planned-work' },
    { field: 'onSchedule', header: 'schedule' },
    { field: 'goodQuantity', header: 'good-quantity' },
    { field: 'scrapQuantity', header: 'scrap-quantity' },
    { field: 'reworkQuantity', header: 'rework-quantity' },
    { field: 'plannedStop', header: 'planned-stop' },
    { field: 'unplannedStop', header: 'unplanned-stop' }
  ];

  // cols = [
  //   {field: 'employeeName', header: 'employee'},
  //   {field: 'day', header: 'day'},
  //   // { field: 'actualWorkPercentage', header: 'actual-work-percentage' },
  //   {field: 'sumOfActualWork', header: 'actual-work'},
  //   {field: 'sumOfPlannedWork', header: 'planned-work'},
  //   {field: 'onSchedule', header: 'schedule'},
  //   {field: 'goodQuantity', header: 'good-quantity'},
  //   {field: 'scrapQuantity', header: 'scrap-quantity'},
  //   {field: 'reworkQuantity', header: 'rework-quantity'},
  //   {field: 'plannedStop', header: 'planned-stop'},
  //   {field: 'unplannedStop', header: 'unplanned-stop'}
  // ];

  cols = [
    { field: 'employeeName', header: 'employee-name' },
    { field: 'workingTime', header: 'working-time' },
    { field: 'stopTime', header: 'stop-time' },
    { field: 'totalTime', header: 'total-time' },
    { field: 'workingEfficiency', header: 'working-efficincy' },
    { field: 'qualityEfficiency', header: 'quality-efficiency' }
  ];

  col = [
    { field: 'stopCauseName', header: 'stop-reason' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeFullName', header: 'name' },
    { field: 'stopDuration', header: 'stop-duration' },
    { field: 'stopPercentage', header: 'stop-percentage' }
  ];

  workCols = [
    { field: 'day', header: 'date' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeName', header: 'name' },
    { field: 'sumOfActualWork', header: 'working-time' },
    { field: 'plannedStop', header: 'planned-stop' },
    { field: 'unplannedStop', header: 'unplanned-stop' },
    { field: 'sumOfPlannedWork', header: 'total-time' },
    { field: 'actualWorkPercetage', header: 'working-efficiency' }
  ];


  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  firstLoad = true;
  workEffWidth = '100%'
  selectedEmployees: any[] = [];
  filteredEmployees: any[];
  private searchTerms = new Subject();
  private searchTermsDetail = new Subject<any>();

  public employeeReportSumDto: EmployeeReportSumDto;
  public employeeReportDetailList: Array<any> = [];
  public pagedEmployeeReportDetailList: Array<any> = [];
  selectedRows = [];
  sub: Subscription;
  empJobAnlFilterInp = null;
  panel = { visible: false, data: null, title: null };
  stopReasonCols = [
    { field: 'jobOrderOperationId', header: 'job-operation-id' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeFullName', header: 'employee-name' },
    { field: 'stopCauseName', header: 'stop-cause-name' },
    { field: 'stopDuration', header: 'stop-duration' },
    { field: 'stopPercentage', header: 'stop-percentage' },
  ]

  selectedEmployeeColumns = [
    { field: 'employeeName', header: 'employee-name' },
    { field: 'workingTime', header: 'working-time' },
    { field: 'stopTime', header: 'stop-time' },
    { field: 'totalTime', header: 'total-time' },
    { field: 'workingEfficiency', header: 'working-efficincy' },
    { field: 'qualityEfficiency', header: 'quality-efficiency' }
  ];


  selectedStopEmployeeColumns = [
    { field: 'stopCauseName', header: 'stop-reason' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeFullName', header: 'name' },
    { field: 'stopDuration', header: 'stop-duration' },
    { field: 'stopPercentage', header: 'stop-percentage' }
  ];

  selectedWorkingEmployeeColumns = [
    { field: 'day', header: 'date' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeName', header: 'name' },
    { field: 'sumOfActualWork', header: 'working-time' },
    { field: 'plannedStop', header: 'planned-stop' },
    { field: 'unplannedStop', header: 'unplanned-stop' },
    { field: 'sumOfPlannedWork', header: 'total-time' },
    { field: 'actualWorkPercentage', header: 'working-efficiency' }
  ];

  allEmployees: any = [];

  constructor(
    private loaderService: LoaderService,
    private _employeeSvc: EmployeeService,
    private _translateSvc: TranslateService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _appStateSvc: AppStateService) {

  }

  getPagedData(pageNumber: number): any[] {
    const dataLength = this.employeeReportDetailList.length ?? 0;
    if (dataLength === 0) {
      return [];
    }
    // this.pagination.


    // this.employeeReportDetailList
    return [];
  }

  ngOnInit() {
    // this.filterCon.rangeStartDate = moment().startOf('month').toDate();
    // this.filterCon.rangeFinishDate = moment(moment.now()).toDate();
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(
        term =>
          this._employeeSvc.filterEmployee(term)
      )
    ).subscribe(res => this.initEmployeeList(res['content']),
      error2 => this.initEmployeeList([]));

    this.searchTermsDetail.pipe(
      debounceTime(400),
      switchMap(term => this._employeeSvc.getEmployeeReportDetail(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.employeeReportDetailList = result['content'];
          this.loaderService.hideLoader();
          this.normalizeValues(this.employeeReportDetailList);
          this.setTableColumns(this.employeeReportDetailList);

        },
        error => {
          this.utilities.showErrorToast(error);
          this.loaderService.hideLoader();
          this.employeeReportDetailList = [];
        }
      );
    this.employeeReportPageFilter = Object.assign(this.employeeReportPageFilter, this.filterCon);

    this.sub = this._appStateSvc.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.searchTerms.next(this.pageFilter);
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSummaryReportDetails() {
    this.loaderService.showLoader();
    const temp = Object.assign({}, this.employeeReportPageFilter);
    temp['startDate'] = temp.rangeStartDate;
    temp['finishDate'] = temp.rangeFinishDate;
    delete temp.rangeStartDate;
    delete temp.rangeFinishDate;
    temp.orderByDirection = null;
    temp.orderByProperty = null;
    this._employeeSvc.getEmployeeJobOrderStopSummaryDetail(temp).then(res => {
      this.panel.title = 'stop-reason-details';
      this.panel.data = res;
      this.panel.data.forEach(item => {
        item.stopDuration = ConvertUtil.longDuration2DHHMMSSTime(item.stopDuration);
        if (item.stopPercentage) {
          item.stopPercentage = (item.stopPercentage).toFixed(2);
        }
      });
      const result = {};
      this.panel.data.forEach((item) => {
        if (!result[item.jobOrderOperationId]) {
          result[item.jobOrderOperationId] = {};
          result[item.jobOrderOperationId].data = item;
          result[item.jobOrderOperationId].key = ConvertUtil.getSimpleUId()
        } else {
          result[item.jobOrderOperationId].children = result[item.jobOrderOperationId].children || [];
          result[item.jobOrderOperationId].children.push({
            data: item, key:
              ConvertUtil.getSimpleUId()
          });
        }
      });
      this.panel.data = [];
      // this.panel.data.data = [];
      for (const property in result) {
        this.panel.data.push(result[property]);
      }
      this.panel.visible = true;
      this.loaderService.hideLoader();
    }).catch(err => {
      this.utilities.showErrorToast(err);
      this.loaderService.hideLoader();
    })
  }

  filter() {
    this.employeeReportPageFilter.pageNumber = 1;

    this.getEmployeeReportDetail();
  }

  getEmployeeReportDetail() {
    this.loaderService.showLoader();
    const temp = Object.assign({}, this.employeeReportPageFilter);
    // if (temp.rangeStartDate) {
    //   temp.rangeStartDate = ConvertUtil.date2StartOfDay(temp.rangeStartDate);
    //   temp.rangeStartDate = ConvertUtil.localDateShiftAsUTC(temp.rangeStartDate);
    //
    // }
    // if (temp.rangeFinishDate) {
    //   temp.rangeFinishDate = ConvertUtil.date2EndOfDay(temp.rangeFinishDate);
    //   temp.rangeFinishDate = ConvertUtil.localDateShiftAsUTC(temp.rangeFinishDate);
    // }
    this.searchTermsDetail.next(temp);
  }

  reOrderData(id, item: string) {

    this.employeeReportPageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.employeeReportPageFilter.orderByDirection = this.classReOrder[id];
    this.filter();
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.employeeReportPageFilter[field] = value;

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

    this.employeeReportPageFilter.pageNumber = this.pagination.pageNumber;
    this.employeeReportPageFilter.pageSize = this.pagination.pageSize;
    this.employeeReportPageFilter.query = this.pagination.tag;


    // Setup base of pagination every time when new data is fetched
    const from = Math.min((this.pagination.currentPage - 1) * this.pagination.pageSize, this.employeeReportDetailList.length);
    const to = Math.min(from + this.pagination.pageSize, this.employeeReportDetailList.length);
    this.pagination.totalPages = Math.ceil(this.employeeReportDetailList.length / this.pagination.pageSize);
    this.pagedEmployeeReportDetailList = this.employeeReportDetailList.slice(from, to);

  }


  private initEmployeeList(res) {
    if (!res || res.length === 0) {
      this.utilities.showInfoToast('EMPLOYEE-NOT-FOUND');
      return;
    }
    this.allEmployees = res.map(emp => ({ ...emp, fullName: `${emp.firstName} ${emp.lastName}` }));
    this.filteredEmployees = [...this.allEmployees];
    this.selectedEmployees = [];

  }

  handleDropdownClickForEmployee() {
    this.filteredEmployees = (this.filteredEmployees && this.filteredEmployees.length) ? [...this.filteredEmployees] : [...this.allEmployees];
    if (this.filteredEmployees.length == 0) {
      this.pageFilter.query = null;
      this.searchTerms.next(this.pageFilter);
    }
  }

  searchEmployee(event) {
    const query = event.query;
    if (query) {
      const filtered: any[] = [];
      if (this.allEmployees && this.allEmployees.length > 0) {
        for (let i = 0; i < this.allEmployees.length; i++) {
          const obj = this.allEmployees[i];
          if (obj['firstName'].toLowerCase().indexOf(query.toLowerCase()) >= 0
            || obj['lastName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(obj);
          }
        }
      }
      if (filtered.length == 0) {
        this.pageFilter.query = query;
        this.searchTerms.next(this.pageFilter);
      }
      this.filteredEmployees = [...filtered];
    }

  }

  onSelectGeneralGroup(event) {
    if (event) {
      this.filteredEmployees = event.members ? [...event.members.map(emp => ({ ...emp, fullName: `${emp.firstName} ${emp.lastName}` }))] : [];
      this.selectedEmployees = [...this.filteredEmployees];
    } else {
      this.filteredEmployees = [];
      this.selectedEmployees = [];
    }
  }

  analyse() {
    const me = this;
    this.firstLoad = false;
    this.loaderService.showLoader();
    this.filterCon.employeeList = [];
    if (this.selectedEmployees != null) {
      this.selectedEmployees.forEach(employee => {
        me.filterCon.employeeList.push(employee.employeeId);
      });
    }
    // get sums.

    const temp = Object.assign({}, me.filterCon);

    // if (temp.rangeStartDate) {
    //   temp.rangeStartDate = ConvertUtil.date2StartOfDay(temp.rangeStartDate);
    //   temp.rangeStartDate = ConvertUtil.localDateShiftAsUTC(temp.rangeStartDate);
    //
    // }
    // if (temp.rangeFinishDate) {
    //   temp.rangeFinishDate = ConvertUtil.date2EndOfDay(temp.rangeFinishDate);
    //   temp.rangeFinishDate = ConvertUtil.localDateShiftAsUTC(temp.rangeFinishDate);
    // }

    temp['plantId'] = this.pageFilter.plantId;
    this._employeeSvc.getEmployeeReportSumGroupedByDayShiftEmployee(temp).then((result) => {
      me.employeeReportSumDto = result as EmployeeReportSumDto;
      me.initializeChart(me.employeeReportSumDto);
      me.initializeCumulativeChart(me.employeeReportSumDto);
      me.initializeWorkingEffeciencyChart(me.employeeReportSumDto);
      if (me.employeeReportSumDto.employeeReportDetailList) {
        me.employeeReportDetailList = me.employeeReportSumDto.employeeReportDetailList;
        this.normalizeValues(this.employeeReportDetailList);
        this.setTableColumns(me.employeeReportDetailList);



        // Setup basic pagination for details
        this.pagination.totalElements = me.employeeReportDetailList?.length ?? 0;
        const from = Math.min((this.pagination.currentPage - 1) * this.pagination.pageSize, this.employeeReportDetailList.length);
        const to = Math.min(from + this.pagination.pageSize, this.employeeReportDetailList.length);
        this.pagination.totalPages = Math.ceil(this.employeeReportDetailList.length / this.pagination.pageSize);
        this.pagedEmployeeReportDetailList = me.employeeReportDetailList.slice(from, to);
      }
      this.employeeWorkEfficiencyList = [];
      for (let key in me.employeeReportSumDto.totalWorkingEfficiencyDto) {
        this.employeeWorkEfficiencyList.push(me.employeeReportSumDto.totalWorkingEfficiencyDto[key]);
      }
      this.cumulativeStopReasonList = [];
      for (let key in me.employeeReportSumDto.cumulativeStopReasonList) {
        this.cumulativeStopReasonList.push(...this.cumulativeStopReasonList, ...me.employeeReportSumDto.cumulativeStopReasonList[key]);
      }
   
      this.employeeReportDetailList = [];
      // for (let key in me.employeeReportSumDto.employeeReportDetailList) {
        this.employeeReportDetailList  =me.employeeReportSumDto.employeeReportDetailList;
      // }
   

    }).catch(error => {
      if (temp.employeeList.length <= 0) {
        this.utilities.showErrorToast('Please Select an Employee');
      } else {
        this.utilities.showErrorToast(error);
      }
      this.loaderService.hideLoader();
    });
    // get details
    // me.employeeReportPageFilter = Object.assign(me.employeeReportPageFilter, temp);
    // this._employeeSvc.getEmployeeReportDetail(me.employeeReportPageFilter)
    //   .then((result) => {
    //     this.pagination.currentPage = result['currentPage'];
    //     this.pagination.totalElements = result['totalElements'];
    //     this.pagination.totalPages = result['totalPages'];
    //     me.employeeReportDetailList = result['content'] as EmployeeReportDetailDto[];
    //     this.normalizeValues(this.employeeReportDetailList);
    //     this.setTableColumns(me.employeeReportDetailList);
    //   })
    //   .catch(error => {
    //     this.utilities.showErrorToast(error);
    //     this.loaderService.hideLoader();
    //   });
    this.loaderService.hideLoader();

    this.empJobAnlFilterInp = Object.assign({}, temp);
  }

  private setTableColumns(eDetailList: Array<EmployeeReportDetailDto>) {
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
        this.selectedColumns = [{ field: 'employeeName', header: 'employee' }, ...this.selectedColumns];
      }
    }
    return;
  }
  showEmployeeModal(employeeId) {
    if (employeeId)
      this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, employeeId);
  }
  showJobOrderOperationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
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
    this.panel = { visible: false, data: null, title: null };
  }

  private getDataSetItem(hexColor, label, data, axisId = 'y-axis-1') {

    return {
      yAxisID: axisId,
      label: label,
      fill: false, // for bar just comment here
      backgroundColor: hexColor,
      borderColor: hexColor,
      borderWidth: 1,
      data: data,
      order: (axisId === 'y-axis-2') ? 1 : 2,
      type: (axisId === 'y-axis-2') ? 'line' : '',
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  seconds2Min(seconds) {
    if (seconds) {
      return seconds / 60;
    }
    return 0;
  }

  normalizeValues(res: EmployeeReportDetailDto[]) {
    // this.myItems = res.map(obj => ({...obj}));
    const me = this;
    if (res && res.length > 0) {
      this.employeeReportDetailList.map(item => {
        item.sumOfActualWork = ConvertUtil.longDuration2DHHMMSSTime(item.sumOfActualWork);
        item.sumOfPlannedWork = ConvertUtil.longDuration2DHHMMSSTime(item.sumOfPlannedWork);
        item.actualWorkPercentage = me.getPercentage(item.actualWorkPercentage);

        item.onSchedule = item.onSchedule.toFixed(2);
        item.plannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.plannedStop);
        item.unplannedStop = ConvertUtil.longDuration2DHHMMSSTime(item.unplannedStop);
        item.goodQuantity = ConvertUtil.fixIfFracted(item.goodQuantity, 2);
        // item.malfunction = me.getReadableTime(item.malfunction * 1000);
      });
    }
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


  initializeChart(item: EmployeeReportSumDto) {
    if (!item) {
      return;
    }
    // working effeciency;
    const newLabels = [];
    const workingTimeList = [];
    const stopTimeList = [];
    const totalTimeList = [];

    const empIntervalWorkingEfficiencyList = [];
    const empIntervalQualityEfficiencyList = [];

    const empAllWorkingEfficiencyList = [];
    const empAllQualityEfficiencyList = [];

    const plantIntervalWorkingEfficiencyList = [];
    const plantIntervalQualityEfficiencyList = [];

    const plantAllWorkingEfficiencyList = [];
    const plantAllQualityEfficiencyList = [];


    // const calculateAll = Object.keys(item.totalWorkingEfficiencyDto).length === 1;

    for (const [key, value] of Object.entries(item.totalWorkingEfficiencyDto)) {
      // const emp = item.employeeReportDetailList.find(x => x.employeeId === +key);
      newLabels.push(value.employeeName);
      workingTimeList.push(parseFloat(this.mills2Hour(value.workingTime).toFixed(2)));
      stopTimeList.push(parseFloat(this.mills2Hour(value.stopTime).toFixed(2)));
      totalTimeList.push(parseFloat(this.mills2Hour(value.workingTime + value.stopTime).toFixed(2)));
      empIntervalWorkingEfficiencyList.push(this.toEfficiency(value.workingEfficiency));
      empIntervalQualityEfficiencyList.push(this.toEfficiency(value.qualityEfficiency));
    }


    let maxEff = 0;
    let max = this.getMax(workingTimeList, stopTimeList, totalTimeList);

    const workingTime = this.getDataSetItem('#ed7d31', 'Working Time', workingTimeList);
    const stopTime = this.getDataSetItem('#a5a5a5', 'Stop Time', stopTimeList);
    const totalTime = this.getDataSetItem('#3f53da', 'Total Time', totalTimeList);
    const workingEfficiency = this.getDataSetItem('#fec105', 'Working Efficiency', empIntervalWorkingEfficiencyList, 'y-axis-2');
    const qualityEfficiency = this.getDataSetItem('#3db245', 'Quality Efficiency', empIntervalQualityEfficiencyList, 'y-axis-2');
    const dataSet = [workingTime, stopTime, totalTime, workingEfficiency, qualityEfficiency];

    maxEff = this.getMax(empIntervalQualityEfficiencyList, empIntervalWorkingEfficiencyList);
    // if (calculateAll) {
    // employee all time efficiency
    empAllWorkingEfficiencyList.push(this.toEfficiency(item.employeeAllTimeWorkingEfficiencyDto?.workingEfficiency));
    empAllQualityEfficiencyList.push(this.toEfficiency(item.employeeAllTimeWorkingEfficiencyDto?.qualityEfficiency));

    // plant all time efficiency
    plantAllWorkingEfficiencyList.push(this.toEfficiency(item.plantAllTimeWorkingEfficiencyDto?.workingEfficiency));
    plantAllQualityEfficiencyList.push(this.toEfficiency(item.plantAllTimeWorkingEfficiencyDto?.qualityEfficiency));

    // plant efficiency between selected interval
    plantIntervalWorkingEfficiencyList.push(this.toEfficiency(item.plantIntervalWorkingEfficiencyDto?.workingEfficiency));
    plantIntervalQualityEfficiencyList.push(this.toEfficiency(item.plantIntervalWorkingEfficiencyDto?.qualityEfficiency));

    const innerMaxEff = this.getMax(plantIntervalWorkingEfficiencyList, plantIntervalQualityEfficiencyList
      , plantAllQualityEfficiencyList, plantAllWorkingEfficiencyList, empAllWorkingEfficiencyList, empAllQualityEfficiencyList);

    if (innerMaxEff > maxEff) {
      maxEff = innerMaxEff;
    }

    const empAllWorkingEfficiency = this.getDataSetItem('#7905fe', 'Work Eff All Time', empAllWorkingEfficiencyList, 'y-axis-2');
    const empAllQualityEfficiency = this.getDataSetItem('#51cbe2', 'Quality Eff All Time', empAllQualityEfficiencyList, 'y-axis-2');

    const plantAllWorkingEfficiency = this.getDataSetItem('#cf2295', 'Plant Work Eff All Time', plantAllWorkingEfficiencyList, 'y-axis-2');
    const plantAllQualityEfficiency = this.getDataSetItem('#084f0d', 'Plant Quality Eff All Time', plantAllQualityEfficiencyList, 'y-axis-2');

    const plantIntervalWorkingEfficiency = this.getDataSetItem('#092067', 'Plant Working Eff ', plantIntervalWorkingEfficiencyList, 'y-axis-2');
    const plantIntervalQualityEfficiency = this.getDataSetItem('#7c4521', 'Plant Quality Eff ', plantIntervalQualityEfficiencyList, 'y-axis-2');

    dataSet.push(empAllWorkingEfficiency, empAllQualityEfficiency, plantAllWorkingEfficiency, plantAllQualityEfficiency, plantIntervalWorkingEfficiency, plantIntervalQualityEfficiency)
    // }


    this.barData = {
      labels: newLabels,
      datasets: dataSet
    };

    this.options = {
      title: {
        display: true,
        text: 'Total Working Efficiency'
      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              max: max === 0 ? 50 : Math.ceil((max + 1) / 10) * 10
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Hours',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
              min: 0,
              max: (maxEff > 100) ? maxEff : 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Efficiency',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        },
        onClick: function (e, legendItem) {
          const index = legendItem.datasetIndex;
          const ci = this.chart;
          const meta = ci.getDatasetMeta(index);
          // See controller.isDatasetVisible comment
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          if (index <= 2) {
            let chckmax = 0
            ci.data.datasets.forEach((data, i) => {
              if (i <= 2) {
                const dtmeta = ci.getDatasetMeta(i);
                if (dtmeta.hidden === null) {
                  data.data.forEach(dt => {
                    if (dt > chckmax) {
                      chckmax = dt;
                    }
                  });
                }
              }
            });
            if (chckmax !== 0) {
              max = chckmax;
            }
            ci.options.scales.yAxes[0].ticks.max = Math.ceil((max + 1) / 10) * 10;
          }

          // We hid a dataset ... rerender the chart
          ci.update();
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            // label += Math.round(tooltipItem.yLabel * 100) / 100;
            // console.log('@tooltipItem', tooltipItem)
            // console.log('@label', label)
            if (label.includes('Time')) {
              return label + ConvertUtil.hourDuration2HHMMSSTime(tooltipItem.yLabel);
              // } else if (tooltipItem.datasetIndex === 3) {
              //   return label + ConvertUtil.fixIfFracted(tooltipItem.yLabel, 2);
            } else {
              return label + tooltipItem.yLabel + '%';
            }
          }
        }
      }
    };

    setTimeout(() => {
      if (this.TotalWorkEffChart) {
        const ci = this.TotalWorkEffChart.chart;
        let chckmax = 0;
        let checkeffmx = 0;
        ci.data.datasets.forEach((data, i) => {
          if (i <= 2) {
            data.data.forEach(dt => {
              if (dt > chckmax) {
                chckmax = dt;
              }
            })
          } else {
            data.data.forEach(dt => {
              if (dt > checkeffmx) {
                checkeffmx = dt;
              }
            })
          }
        });
        if (chckmax !== 0) {
          max = chckmax;
        }
        ci.options.scales.yAxes[0].ticks.max = Math.ceil((max + 1) / 10) * 10;
        ci.options.scales.yAxes[1].ticks.max = Math.ceil((checkeffmx + 1) / 10) * 10;
        ci.update();
      }
    }, 200);
  }

  private toEfficiency(value): number {
    // if (value > 1) {
    //   return 100;
    // }
    return ConvertUtil.fixIfFracted(value * 100, 2);
  }

  initializeCumulativeChart(item: EmployeeReportSumDto) {

    const labelsCumulative = [];
    const pauseList = new Object();
    const dataSets = [];

    let stopCauseList = [];

    for (const [key, value] of Object.entries(item.cumulativeStopReasonList)) {
      const employee = item.employeeReportDetailList.find(x => x.employeeId === +key);
      const cumulativeStopReasonList = item.cumulativeStopReasonList[key];
      if (employee) {
        labelsCumulative.push(employee.employeeName);
      }
      stopCauseList.push(...cumulativeStopReasonList.map(cm => ({ stopCauseName: cm.stopCauseName })));
    }

    stopCauseList = [...new Set(stopCauseList.map(item => item.stopCauseName))];

    for (const [key, value] of Object.entries(item.cumulativeStopReasonList)) {
      const cumulativeStopReasonList = item.cumulativeStopReasonList[key];
      if (cumulativeStopReasonList) {
        stopCauseList.forEach(itm => {
          const cmValue = cumulativeStopReasonList.find(cmitm => cmitm.stopCauseName === itm)
          if (cmValue) {
            if (pauseList.hasOwnProperty(cmValue.stopCauseName)) {
              pauseList[cmValue.stopCauseName].push(parseFloat(this.mills2Hour(cmValue.stopDuration).toFixed(2)));
            } else {
              pauseList[cmValue.stopCauseName] = [];
              pauseList[cmValue.stopCauseName].push(parseFloat(this.mills2Hour(cmValue.stopDuration).toFixed(2)));
            }
          } else {
            if (pauseList.hasOwnProperty(itm)) {
              pauseList[itm].push(parseFloat('0').toFixed(2));
            } else {
              pauseList[itm] = [];
              pauseList[itm].push(parseFloat('0').toFixed(2));
            }
          }
        });
      }

    }
    let max = 0;
    // /now set dataset
    for (const [key, value] of Object.entries(pauseList)) {
      dataSets.push(this.getDataSetItem(this.getRandomColor(), key, value));
      max = this.getMax(value);
    }

    this.cumulativeBarData = {
      labels: labelsCumulative,
      datasets: dataSets
    }

    this.cumulativeOptions = {
      title: {
        display: true,
        text: 'Cumulative Stop Reasons by Employee'
      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              max: max === 0 ? 10 : Math.ceil(max)
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Hours',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,

            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Efficiency',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        },
        onClick: function (e, legendItem) {
          const index = legendItem.datasetIndex;
          const ci = this.chart;
          const meta = ci.getDatasetMeta(index);

          // See controller.isDatasetVisible comment
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          let chckmax = 0
          ci.data.datasets.forEach((data, i) => {
            const dtmeta = ci.getDatasetMeta(i);
            if (dtmeta.hidden === null) {
              data.data.forEach(dt => {
                if (dt > chckmax) {
                  chckmax = dt;
                }
              });
            }
          });
          if (chckmax !== 0) {
            max = chckmax;
          }
          ci.options.scales.yAxes[0].ticks.max = Math.ceil(max);

          // We hid a dataset ... rerender the chart
          ci.update();
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            // label += Math.round(tooltipItem.yLabel * 100) / 100;
            // console.log('@tooltipItem', tooltipItem)
            // console.log('@label', label)
            // if (tooltipItem.datasetIndex < 2) {
            return label + ConvertUtil.hourDuration2HHMMSSTime(tooltipItem.yLabel);
            // } else {
            // return label + tooltipItem.yLabel;
            // }
          }
        }
      }
    };

    setTimeout(() => {
      if (this.CumulativeStopChart) {
        const ci = this.CumulativeStopChart.chart;
        let chckmax = 0
        ci.data.datasets.forEach((data, i) => {
          data.data.forEach(dt => {
            if (dt > chckmax) {
              chckmax = dt;
            }
          });
        });
        if (chckmax !== 0) {
          max = chckmax;
        }
        ci.options.scales.yAxes[0].ticks.max = Math.ceil(max);
        ci.update();
      }
    }, 200);
  }

  onHide() {
    this.panel = { visible: false, data: null, title: null };
  }

  initializeWorkingEffeciencyChart(item: EmployeeReportSumDto) {
    if (!item) {
      return;
    }

    // working effeciency;
    const newLabels = [];
    const workingTimeList = [];
    const totalTimeList = [];
    const plannedStopTimeList = [];
    const unPlannedStopTimeList = [];
    const workingEffeciencyList = [];
    let widthsize = 100;
    widthsize = widthsize + (item.employeeReportDetailList.length * 15)
    if (item.employeeReportDetailList.length > 15) {
      this.workEffWidth = 1000 + widthsize + 'px';
    } else {
      this.workEffWidth = '100%';
    }
    item.employeeReportDetailList.forEach(itm => {
      newLabels.push([itm.employeeName, itm.shiftName + ' | ' + itm.day]);
      workingTimeList.push(parseFloat(this.mills2Hour(itm.sumOfActualWork).toFixed(2)));
      plannedStopTimeList.push(parseFloat(this.mills2Hour(itm.plannedStop).toFixed(2)));
      unPlannedStopTimeList.push(parseFloat(this.mills2Hour(itm.unplannedStop).toFixed(2)));
      totalTimeList.push(
        parseFloat(this.mills2Hour(itm.sumOfActualWork).toFixed(2)) +
        parseFloat(this.mills2Hour(itm.plannedStop).toFixed(2)) +
        parseFloat(this.mills2Hour(itm.unplannedStop).toFixed(2))
      )
      workingEffeciencyList.push(this.toEfficiency(itm.onSchedule));
    })
    // console.log('@oworkingEffecinelList', )


    const maxEff = this.getMax(workingEffeciencyList);

    let max = this.getMax(unPlannedStopTimeList, totalTimeList, plannedStopTimeList, workingTimeList)

    const workingTime = this.getDataSetItem('#3db245', 'Working Time', workingTimeList);
    const plannedStopTime = this.getDataSetItem('#ed7d31', 'Planned Stop', plannedStopTimeList);
    const unplannedStopTime = this.getDataSetItem('#fec105', 'Unplanned Stop', unPlannedStopTimeList);
    const totalTime = this.getDataSetItem('#3f53da', 'Total Time', totalTimeList);
    const workingEffeciency = this.getDataSetItem('#a5a5a5', 'Working Efficiency', workingEffeciencyList, 'y-axis-2');
    this.workingEffeciencyData = {
      labels: newLabels,
      datasets: [workingTime, plannedStopTime, unplannedStopTime, totalTime, workingEffeciency]
    };

    this.workingEffeciencyOptions = {
      title: {
        display: true,
        text: 'Working Efficiency'
      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              max: max === 0 ? 50 : Math.ceil((max + 1) / 10) * 10
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Hours',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
              min: 0,
              max: (maxEff > 100) ? maxEff : 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        },
        onClick: function (e, legendItem) {
          const index = legendItem.datasetIndex;
          const ci = this.chart;
          const meta = ci.getDatasetMeta(index);

          // See controller.isDatasetVisible comment
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          if (index <= 3) {
            let chckmax = 0
            ci.data.datasets.forEach((data, i) => {
              if (i <= 3) {
                const dtmeta = ci.getDatasetMeta(i);
                if (dtmeta.hidden === null) {
                  data.data.forEach(dt => {
                    if (dt > chckmax) {
                      chckmax = dt;
                    }
                  });
                }
              }
            });
            if (chckmax !== 0) {
              max = chckmax;
            }
            ci.options.scales.yAxes[0].ticks.max = Math.ceil((max + 1) / 10) * 10;
          }
          // We hid a dataset ... rerender the chart
          ci.update();
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            // label += Math.round(tooltipItem.yLabel * 100) / 100;
            // console.log('@tooltipItem', tooltipItem)
            // console.log('@label', label)
            if (tooltipItem.datasetIndex <= 3) {
              return label + ConvertUtil.hourDuration2HHMMSSTime(tooltipItem.yLabel);
            } else {
              return label + tooltipItem.yLabel + '%';
            }
          }
        }
      }
    };

    setTimeout(() => {
      if (this.WorkEffChart) {
        const ci = this.WorkEffChart.chart;
        let chckmax = 0;
        let chckmax2 = 0;
        ci.data.datasets.forEach((data, i) => {
          if (data.yAxisID === 'y-axis-1') {
            data.data.forEach(dt => {
              if (dt > chckmax) {
                chckmax = dt;
              }
            });
          } else {
            data.data.forEach(dt => {
              if (dt > chckmax2) {
                chckmax2 = dt;
              }
            });
          }
        });
        if (chckmax !== 0) {
          max = chckmax;
        }
        if (chckmax2 < 100) {
          chckmax2 = 90
        }
        ci.options.scales.yAxes[0].ticks.max = Math.ceil((max + 1) / 10) * 10;
        ci.options.scales.yAxes[1].ticks.max = Math.ceil((chckmax2 + 1) / 10) * 10;
        ci.update();
      }
    }, 200);
  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  private mills2Hour(workingTime: number) {
    if (workingTime) {
      return workingTime / (1000 * 60 * 60);
    }
    return 0;
  }

  private getMax(...empIntervalQualityEfficiencyLists: any[]) {
    let maxEff = 0;

    empIntervalQualityEfficiencyLists.forEach(empIntervalQualityEfficiencyList => {
      empIntervalQualityEfficiencyList.forEach(itm => {
        if (itm > maxEff) {
          maxEff = itm;
        }
      });
    });
    return maxEff;
  }



  exportCSV(selected: boolean = false, type: BookType) {
    if (selected) {
      const mappedDAta = this.selectedRows.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field == "reportDay") {
            obj[this._translateSvc.instant(col.header)] = itm.reportDay ? new Date(itm.reportDay).toLocaleString() : '';
          } else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Employee Efficiency Details');
    } else {
      this.loaderService.showLoader();
      this._employeeSvc.getEmployeeReportDetail({ ...this.employeeReportPageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then((result) => {
          this.employeeReportDetailList = result['content'] as EmployeeReportDetailDto[];
          this.normalizeValues(this.employeeReportDetailList);
          this.setTableColumns(this.employeeReportDetailList);
          const mappedDAta = this.employeeReportDetailList.map(itm => {
            const obj = {};
            this.selectedRows.forEach(col => {
              if (col.field == "reportDay") {
                obj[this._translateSvc.instant(col.header)] = itm.reportDay ? new Date(itm.reportDay).toLocaleString() : '';
              } else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.loaderService.hideLoader();
          this.appStateService.exportAsFile(mappedDAta, type, 'Employee Efficiency Details');
        })
        .catch(error => {
          this.utilities.showErrorToast(error);
          this.loaderService.hideLoader();
        });
    }
  }
 
}
