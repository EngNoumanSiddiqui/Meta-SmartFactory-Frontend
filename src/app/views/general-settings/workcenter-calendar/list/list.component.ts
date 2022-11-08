import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'workcenter-calendar-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class WorkCenterCalendarListComponent implements OnInit, OnDestroy {

  private searchTerms = new Subject<any>();
  tableData: any[] = [
    // { calendarCode: 1, calendarCategory: 'this is desc', workDays: '' }
  ];
  selectedData: any;
  selectedColumns = [
    { field: 'workCenterCalendarId', header: 'workcenter-calendar-id' },
    { field: 'calendarReferenceId', header: 'reference-id' },
    { field: 'simulation', header: 'simulation' },
    { field: 'workCenterName', header: 'workcenter' },
    { field: 'workStationName', header: 'workstation' },
    { field: 'startTime', header: 'start-time' },
    { field: 'endTime', header: 'end-time' },
  ];
  cols = [
    { field: 'workCenterCalendarId', header: 'workcenter-calendar-id' },
    { field: 'calendarReferenceId', header: 'reference-id' },
    { field: 'simulation', header: 'simulation' },
    { field: 'plantId', header: 'plant' },
    { field: 'workCenterName', header: 'workcenter' },
    { field: 'workStationName', header: 'workstation' },
    { field: 'startTime', header: 'start-time' },
    { field: 'endTime', header: 'end-time' },
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

  pageFilter = {
    pageNumber: 1,
    plantId: null,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    calendarReferenceId: null,
    endTime: null,
    startTime: null,
    workCenterCalendarId: null,
    workCenterId: null,
    workStationId: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  classReOrder = ['desc', 'asc', 'asc', 'asc'];

  calendarModal = {
    modal: null,
    id: null,
    active: false,
    data: null
  };
  selectedPlant: any;
  sub: Subscription;
  constructor(
    private loaderService: LoaderService,
    private workstationService: WorkstationService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
  ) {
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.workstationService.filterWorkCenterCalendar(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.tableData = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.tableData = [];
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error)
        }
      );
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.pageFilter.plantId = res.plantId;
        this.selectedPlant = res;
        this.filter(this.pageFilter);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    // console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }
  search(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }
  myPageChanged(event) {
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
    this.search(this.pageFilter)
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

  modalShow(id, mod: string, data?) {
    this.calendarModal.id = id;
    this.calendarModal.modal = mod;
    this.calendarModal.active = true;
    this.calendarModal.data = data ? data : null;
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      plantId: null,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      query: null,
      calendarReferenceId: null,
      endTime: null,
      startTime: null,
      workCenterCalendarId: null,
      workCenterId: null,
      workStationId: null,
      orderByProperty: 'workCenterCalendarId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }
  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.workstationService.deleteFactoryCalendar(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showPlantDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
  }

  showWorkCenterDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER, id);
  }

  showWorkStationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }

}
