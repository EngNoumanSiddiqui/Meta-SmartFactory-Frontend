import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StopService } from 'app/services/dto-services/stop/stop.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'stop-joborder-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class StopListJobOrderComponent implements OnInit, OnChanges {

  tableData  = [];
  @Input() detailMode = false;
  cols = [
    {field: 'stopId', header: 'stop-id'},
    {field: 'jobOrderOperationId', header: 'job-order-operation-id'},
    {field: 'workStation', header: 'workstation'},
    {field: 'stopCauseId', header: 'stop-cause-id'},
    {field: 'stopCauseName', header: 'stop-cause-name'},
    {field: 'actualStartTime', header: 'actual-start-time'},
    {field: 'actualStopTime', header: 'actual-stop-time'},
    {field: 'duration', header: 'duration'},
    {field: 'shiftId', header: 'shift-id'},
    {field: 'employee', header: 'employee'},
    // {field: 'employee', header: 'employee-lastname'},
    {field: 'actualCost', header: 'actual-cost'},
    {field: 'currency', header: 'currency'},
  ];
  pageFilter = {
    actualFinishTime: null,
    actualStartTime: null,
    employeeId: null,
    jobOrderOperationId: null,
    orderByDirection: 'asc',
    orderByProperty: 'actualStartTime',
    pageNumber: 1,
    pageSize: 999,
    query: null,
    shiftId: null,
    stopCauseId: null,
    stopCauseName: null,
    employee:null,
    stopId: null,
    workStationId: null,
  }

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc','asc', 'asc'];
  @Input('jobOrderOperationId') jobOrderOperationId = null;
  //   if(jobOrderOperationId) {
  //     this.pageFilter.jobOrderOperationId = jobOrderOperationId;
  //     // this.loaderService.showLoader();
  //     // this.searchTerms.next(this.pageFilter);
  //   }
  // }
  private searchTerms = new Subject<any>();

  constructor(private loaderService: LoaderService,
    private stopService: StopService,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    // this.searchTerms.pipe(
    //   debounceTime(400),
    //   switchMap(term => this.stopService.filterObs(term))).subscribe(
    //     result => {
    //       this.tableData = result['content'];
    //       // this.pagination.currentPage = result['currentPage'];
    //       // this.pagination.totalElements = result['totalElements'];
    //       // this.pagination.totalPages = result['totalPages'];
    //       this.loaderService.hideLoader();
    //     },
    //     error2 => {
    //       this.tableData = [];
    //       this.loaderService.hideLoader();
    //       this.utilities.showErrorToast(error2)
    //     });
  }

  showWorkstationDetail(wkrId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, wkrId);
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
  filter() {
    this.loaderService.showLoader();
    this.stopService.filter(this.pageFilter).then(
          result => {
            this.tableData = result['content'];
            // this.pagination.currentPage = result['currentPage'];
            // this.pagination.totalElements = result['totalElements'];
            // this.pagination.totalPages = result['totalPages'];
            this.loaderService.hideLoader();
          }).catch(
          error2 => {
            this.tableData = [];
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error2)
          });
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time)
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges.jobOrderOperationId) {
      this.pageFilter.jobOrderOperationId = simpleChanges.jobOrderOperationId.currentValue;
      this.filter();
      // this.searchTerms.next(this.pageFilter);
    }
  }

}
