import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {QualityReportTypeService} from 'app/services/dto-services/quality-report-type/quality-report-type.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListQualityReportTypes implements OnInit, OnDestroy {

  qualityReportTypeModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'qualityNotificationReportTypeId', header: 'report-type-id', index:1 },
    { field: 'qualityNotificationReportTypeCode', header: 'code', index:2 },
    { field: 'qualityNotificationReportTypeShortText', header: 'short-text', index:3 },
  ];
  cols = [
    { field: 'qualityNotificationReportTypeId', header: 'report-type-id', index:1 },
    { field: 'qualityNotificationReportTypeCode', header: 'code', index:2 },
    { field: 'qualityNotificationReportTypeShortText', header: 'short-text', index:3 }
  ];

  showLoader = false;
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    qualityNotificationReportTypeCode: null,
    qualityNotificationReportTypeId: null,
    qualityNotificationReportTypeShortText: null,
    query: null,
    plantId: null,
    orderByProperty: 'qualityNotificationReportTypeId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc'];

  qualityReportTypes = [];
  selectedQualityReportTypes = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;
  sub: any;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string, data?: any) {
    this.qualityReportTypeModal.id = id;
    this.qualityReportTypeModal.modal = mod;
    this.qualityReportTypeModal.data = data;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.qualityReportTypeModal.modal = mod;
    this.qualityReportTypeModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.qualityReportTypeModal.modal = 'NEW';
      myModal.show();
    }
    this.qualityReportTypeModal.id = null;
    this.isSaveAndNew = false;
    this.selectedQualityReportTypes = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _qualityReportTypeService: QualityReportTypeService
  ) {}

  ngOnInit() {
    
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._qualityReportTypeService.filterObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.qualityReportTypes = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.qualityReportTypes = [];
      }
    );

    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (res) {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  // FILTERING AREA
  filtingAreaColumns (event) {
    this.selectedColumns.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
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

    this.search(this.pageFilter);
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
      qualityNotificationReportTypeCode: null,
    qualityNotificationReportTypeId: null,
    plantId: this.pageFilter.plantId,
    qualityNotificationReportTypeShortText: null,
      query: null,
      orderByProperty: 'qualityReportTypeId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-causes',
      accept: () => {
          this._qualityReportTypeService.delete(id).then(
            result => {
              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.qualityReportTypes = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
