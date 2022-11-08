import {Component, OnDestroy, OnInit} from '@angular/core';
import {StopService} from '../../../../services/dto-services/stop/stop.service';
import {ResponseEmployeeWorkDetailDto} from '../../../../dto/analysis/employee/employee-stop-item';
import {UtilitiesService} from '../../../../services/utilities.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {ConvertUtil} from '../../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  templateUrl: './all-employee-analysis.html',

})
export class AllEmployeeAnalysisComponent implements OnInit, OnDestroy{
  showLoader = false;

  myWorkDetails: ResponseEmployeeWorkDetailDto[];

  selectedWorkDetails = [];

  employeeId: number;
  employeeName: string;
  totalWorkingTime: string;
  stopDuration: string;
  netWorkingTime: string;
  workingTimeEfficiency: string;

  cols = [
    {field: 'employeeId', header: 'id', order: null},
    {field: 'employeeName', header: 'employee', order: 'FIRST_NAME'},
    {field: 'totalWorkingTime', header: 'total-working-time', order: 'TOTAL'},
    {field: 'stopDuration', header: 'stop-duration', order: 'STOP_DURATION'},
    {field: 'netWorkingTime', header: 'net-working-time', order: 'NET_WORKING_TIME'},
    {field: 'workingTimeEfficiency', header: 'working-time-efficiency', order: null}
  ];

  selectedColumns = [
    {field: 'employeeId', header: 'id', order: null},
    {field: 'employeeName', header: 'employee', order: 'FIRST_NAME'},
    {field: 'totalWorkingTime', header: 'total-working-time', order: 'TOTAL'},
    {field: 'stopDuration', header: 'stop-duration', order: 'STOP_DURATION'},
    {field: 'netWorkingTime', header: 'net-working-time', order: 'NET_WORKING_TIME'},
    {field: 'workingTimeEfficiency', header: 'working-time-efficiency', order: null}
  ];


  validEmployee = {
    startDate: null,
    endDate: null
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

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    endDate: null,
    startDate: null,
    plantId: null,
    query: null,
    orderByProperty: 'FIRST_NAME',
    orderByDirection: 'asc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  sub: Subscription;


  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
              private _stopSvc: StopService) {


  }


  ngOnInit(): void {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if(res) {
          this.pageFilter.plantId = res.plantId;
      }
    });
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }


  showEmployeeDetail(empId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, empId);
  }

  exportAsPdf(printSectionId: string) {
    this.utilities.exportAsPdf(printSectionId);
  }
  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }
  analyze() {
    this.loaderService.showLoader();
    this.showLoader = true;
    if (this.pageFilter.startDate) {

      this.validEmployee.startDate = this.pageFilter.startDate;
    }
    if (this.pageFilter.endDate) {
      this.validEmployee.endDate = this.pageFilter.endDate;
    }

    this.filter(this.pageFilter);

  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this._stopSvc.allEmployeeWorkstationsStops(data)
      .then(result => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.myWorkDetails = result['content'] as ResponseEmployeeWorkDetailDto[];
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.showLoader = false;
        this.utilities.showErrorToast(error)
      });
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
      this.filter(this.pageFilter)
    }, 500);
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      query: null,
      plantId: this.pageFilter.plantId,
      startDate: null,
      endDate: null,
      orderByProperty: 'FIRST_NAME',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }


}
