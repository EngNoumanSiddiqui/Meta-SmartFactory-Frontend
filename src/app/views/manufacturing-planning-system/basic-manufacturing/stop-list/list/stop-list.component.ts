import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { StopService } from 'app/services/dto-services/stop/stop.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { environment } from 'environments/environment';
import { ConfirmationService, MenuItem } from 'primeng';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BookType } from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss']
})
export class StopListComponent implements OnInit {



  tableData = [];
  selectedData = [];
  selectedColumns = [
    { field: 'stopId', header: 'stop-id' },
    { field: 'stopCauseId', header: 'stop-cause-id' },
    { field: 'stopCauseName', header: 'stop-cause-name' },
    { field: 'workStation', header: 'workstation' },
    { field: 'duration', header: 'duration' },
    { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'shiftId', header: 'shift-id' },
    { field: 'actualStartTime', header: 'actual-start-time' },
    { field: 'actualStopTime', header: 'actual-stop-time' },
    { field: 'actualCost', header: 'actual-cost' },
    { field: 'currency', header: 'currency' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeFirstName', header: 'first-name' },
    { field: 'employeeLastName', header: 'last-name' }
  ];
  cols = [
    { field: 'stopId', header: 'stop-id' },
    { field: 'stopCauseId', header: 'stop-cause-id' },
    { field: 'stopCauseName', header: 'stop-cause-name' },
    { field: 'workStation', header: 'workstation' },
    { field: 'duration', header: 'duration' },
    { field: 'jobOrderOperationId', header: 'job-order-operation-id' },
    { field: 'referenceId', header: 'reference-id' },
    { field: 'shiftId', header: 'shift-id' },
    { field: 'actualStartTime', header: 'actual-start-time' },
    { field: 'actualStopTime', header: 'actual-stop-time' },
    { field: 'actualCost', header: 'actual-cost' },
    { field: 'currency', header: 'currency' },
    { field: 'employeeId', header: 'employee-id' },
    { field: 'employeeFirstName', header: 'first-name' },
    { field: 'employeeLastName', header: 'last-name' }

  ];

  @Input('filteredData') set setStopCauseId(data) {
    if (data) {
      this.pageFilter.stopCauseId = data.stopCauseId;
      this.pageFilter.actualStartTime = data.startDate;
      this.pageFilter.actualFinishTime = data.finishDate;
      this.pageFilter.shiftId = data.shiftId;
      this.pageFilter.workStationId = data.workstationId;
    }
  }


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
    actualFinishTime: null,
    actualStartTime: null,
    plantId: null,
    employeeId: null,
    jobOrderOperationId: null,
    orderByDirection: "desc",
    orderByProperty: "stopId",
    query: null,
    shiftId: null,
    stopCauseId: null,
    stopCauseName: null,
    stopId: null,
    workStationId: null,
    workStationName: null,
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

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  private searchTerms = new Subject<any>();
  sub: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private appStateSvc: AppStateService,
    private stopService: StopService,
    private datePipe: DatePipe,
    private loaderService: LoaderService,) {
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.stopService.filter(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.selectedData = [];
          this.tableData = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.utilities.showErrorToast(error)
          this.loaderService.hideLoader();
        }
      );


    this.sub = this.appStateSvc.plantAnnounced$.subscribe((res: any) => {
      if ((res) && res.plantId) {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      } else {
        this.filter(this.pageFilter);
      }
    });
  }

  showWorkstationDetail(wkrId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, wkrId);
  }
  showJOOPDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, id);
  }
  showShiftDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.SHIFTSETTING, id);
  }
  showStopCauseDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOPCAUSE, id);
  }
  showEmpDetail(wkrId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, wkrId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
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

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time)
  }


  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      actualFinishTime: null,
      actualStartTime: null,
      plantId: this.pageFilter.plantId,
      employeeId: null,
      jobOrderOperationId: null,
      orderByDirection: "desc",
      orderByProperty: "stopId",
      query: null,
      shiftId: null,
      stopCauseId: null,
      stopCauseName: null,
      stopId: null,
      workStationId: null,
      workStationName: null,
    }
    this.filter(this.pageFilter);
  }



  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if (field === 'workStation') {
      this.pageFilter.workStationName = value;
    } else {
      this.pageFilter[field] = value;
    }

    this.filter(this.pageFilter);
  }

  exportCSV(selected: boolean = false, type: BookType) {
    if (selected) {
      const mappedDAta = this.selectedData.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if (col.field == "stopId") {
            obj[this._translateSvc.instant('stop-id')] = itm.stopId;
          } else if (col.field == "stopCauseId") {
            obj[this._translateSvc.instant(col.header)] = itm.stopCauseId;
          } else if (col.field == "stopCauseName") {
            obj[this._translateSvc.instant(col.header)] = itm.stopCauseName;
          } else if (col.field == "workStation") {
            obj[this._translateSvc.instant(col.header)] = itm.workStation?.workStationName;
          } else if (col.field == "duration") {
            obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.duration);
          } else if (col.field == "jobOrderOperationId") {
            obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperationId;
          } else if (col.field == "referenceId") {
            obj[this._translateSvc.instant(col.header)] = itm.referenceId;
          } else if (col.field == "shiftId") {
            obj[this._translateSvc.instant(col.header)] = itm.shiftId;
          } else if (col.field == "actualStartTime") {
            obj[this._translateSvc.instant(col.header)] = itm.actualStartTime ? this.datePipe.transform(new Date(itm.actualStartTime), 'dd/MM/yyyy HH:mm') : '';
          }
          else if (col.field == "actualStopTime") {
            obj[this._translateSvc.instant(col.header)] = itm.actualStopTime ? this.datePipe.transform(new Date(itm.actualStopTime), 'dd/MM/yyyy HH:mm') : '';
          }
          else if (col.field == "actualCost") {
            obj[this._translateSvc.instant(col.header)] = itm.actualCost;
          }
          else if (col.field == "currency") {
            obj[this._translateSvc.instant(col.header)] = itm.currency;
          }
          else if (col.field == "employeeId") {
            obj[this._translateSvc.instant(col.header)] = itm.employee?.employeeId;
          }
          else if (col.field == "employeeFirstName") {
            obj[this._translateSvc.instant(col.header)] = itm.employee?.firstName;
          } else if (col.field == "employeeLastName") {
            obj[this._translateSvc.instant(col.header)] = itm.employee?.lastName;
          }


          else if (itm.hasOwnProperty(col.field)) {
            obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateSvc.exportAsFile(mappedDAta, type, 'stopList');
    } else {
      this.loaderService.showLoader();
      this.stopService.filter({ ...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements })
        .then(result => {
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if (col.field == "stopId") {
                obj[this._translateSvc.instant('stop-id')] = itm.stopId;
              } else if (col.field == "stopCauseId") {
                obj[this._translateSvc.instant(col.header)] = itm.stopCauseId;
              } else if (col.field == "stopCauseName") {
                obj[this._translateSvc.instant(col.header)] = itm.stopCauseName;
              } else if (col.field == "workStation") {
                obj[this._translateSvc.instant(col.header)] = itm.workStation?.workStationName;
              } else if (col.field == "duration") {
                obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.duration);
              } else if (col.field == "jobOrderOperationId") {
                obj[this._translateSvc.instant(col.header)] = itm.jobOrderOperationId;
              } else if (col.field == "referenceId") {
                obj[this._translateSvc.instant(col.header)] = itm.referenceId;
              } else if (col.field == "shiftId") {
                obj[this._translateSvc.instant(col.header)] = itm.shiftId;
              } else if (col.field == "actualStartTime") {
                obj[this._translateSvc.instant(col.header)] = itm.actualStartTime ? this.datePipe.transform(new Date(itm.actualStartTime), 'dd/MM/yyyy HH:mm') : '';
              }
              else if (col.field == "actualStopTime") {
                obj[this._translateSvc.instant(col.header)] = itm.actualStopTime ? this.datePipe.transform(new Date(itm.actualStopTime), 'dd/MM/yyyy HH:mm') : '';
              }
              else if (col.field == "actualCost") {
                obj[this._translateSvc.instant(col.header)] = itm.actualCost;
              }
              else if (col.field == "currency") {
                obj[this._translateSvc.instant(col.header)] = itm.currency;
              }
              else if (col.field == "employeeId") {
                obj[this._translateSvc.instant(col.header)] = itm.employee?.employeeId;
              }
              else if (col.field == "employeeFirstName") {
                obj[this._translateSvc.instant(col.header)] = itm.employee?.firstName;
              } else if (col.field == "employeeLastName") {
                obj[this._translateSvc.instant(col.header)] = itm.employee?.lastName;
              }


              else if (itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
              }
            });
            return (obj);
          });
          this.appStateSvc.exportAsFile(mappedDAta, type, 'stopList');
          this.loaderService.hideLoader();
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        })
    }
  }

}
