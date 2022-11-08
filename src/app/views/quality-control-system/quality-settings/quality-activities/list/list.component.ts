import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { debounceTime, switchMap } from 'rxjs/operators';
import { QualityActivityTypeService } from 'app/services/dto-services/quality-activity-type/quality.activity.type.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListQualityActivity implements OnInit, OnDestroy {

  qualityActivityModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'qualityActivityTypeId', header: 'activity-type-id' },
    { field: 'qualityActivityTypeCode', header: 'activity-type-code' },
    { field: 'qualityActivityTypeName', header: 'activity-type-name' },
    { field: 'qualityActivityTypeShortText', header: 'activity-type-short-text' },
  ];
  cols = [
    { field: 'qualityActivityTypeId', header: 'activity-type-id' },
    { field: 'qualityActivityTypeCode', header: 'activity-type-code' },
    { field: 'qualityActivityTypeName', header: 'activity-type-name' },
    { field: 'qualityActivityTypeShortText', header: 'activity-type-short-text' },
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
    plantId: null,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    qualityActivityTypeCode: null,
    qualityActivityTypeId: null,
    qualityActivityTypeName: null,
    qualityActivityTypeShortText: null,
    createDate: null,
    query: null,
    updateDate: null,
    orderByProperty: 'activityId',
    orderByDirection: 'desc',
  };

  classReOrder = ['asc', 'asc'];

  qualityActivitys = [];
  selectedQualityActivitys = [];
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
    this.qualityActivityModal.id = id;
    this.qualityActivityModal.modal = mod;
    this.qualityActivityModal.data = data;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.qualityActivityModal.modal = mod;
    this.qualityActivityModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.qualityActivityModal.modal = 'NEW';
      myModal.show();
    }
    this.qualityActivityModal.id = null;
    this.isSaveAndNew = false;
    this.selectedQualityActivitys = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private appStateService: AppStateService,
    private _qualityActivityTypeSvc: QualityActivityTypeService
  ) { }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._qualityActivityTypeSvc.filterObservable(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.qualityActivitys = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.utilities.showErrorToast(error);
          this.loaderService.hideLoader();
          this.qualityActivitys = [];
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
      this.sub?.unsubscribe();
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
  filtingAreaColumns(event) {
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
    if (item === 'activityName' || item === 'shortText') {
      this.classReOrder[id] = null;
    }
    else if (this.classReOrder[id] === 'asc') {
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      qualityActivityTypeCode: null,
      qualityActivityTypeId: null,
      plantId: this.pageFilter.plantId,
      qualityActivityTypeName: null,
      qualityActivityTypeShortText: null,
      createDate: null,
      query: null,
      updateDate: null,
      orderByProperty: 'activityId',
      orderByDirection: 'desc',
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-activity',
      accept: () => {
        this._qualityActivityTypeSvc.delete(id).then(
          result => {
            this.pagination.currentPage = result['currentPage'];
            this.pagination.totalElements = result['totalElements'];
            this.pagination.totalPages = result['totalPages'];
            this.qualityActivitys = result['content'];
            this.loaderService.hideLoader();

            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          },
          error => {
            this.utilities.showErrorToast(error);
            this.loaderService.hideLoader();
            this.qualityActivitys = [];
          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
