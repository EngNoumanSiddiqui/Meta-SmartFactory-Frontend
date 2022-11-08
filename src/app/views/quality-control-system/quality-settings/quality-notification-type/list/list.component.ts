import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListQualityNotificationType implements OnInit, OnDestroy {

  qualityNotificationTypeModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'qualityNotificationTypeId', header: 'notification-type-id', index:1 },
    { field: 'qualityNotificationTypeCode', header: 'code', index:2 },
    { field: 'text', header: 'description', index:3 },
  ];
  cols = [
    { field: 'qualityNotificationTypeId', header: 'notification-type-id', index:1 },
    { field: 'qualityNotificationTypeCode', header: 'code', index:2 },
    { field: 'text', header: 'description', index:3 },
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
    qualityNotificationTypeId: null,
    qualityNotificationTypeCode: null,
    text: null,
    plantId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc'];

  qualityNotificationTypes = [];
  selectedQualityNotificationTypes = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;
  sub: any;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.qualityNotificationTypeModal.id = id;
    this.qualityNotificationTypeModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.qualityNotificationTypeModal.modal = mod;
    this.qualityNotificationTypeModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.qualityNotificationTypeModal.modal = 'NEW';
      myModal.show();
    }
    this.qualityNotificationTypeModal.id = null;
    this.isSaveAndNew = false;
    this.selectedQualityNotificationTypes = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _qualityNotificationTypeService: QualityNotificationTypeService
  ) {}

  ngOnInit() {
    this.qualityNotificationTypes = [];
    // this.loaderService.showLoader();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._qualityNotificationTypeService.filter(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.qualityNotificationTypes = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );
    // console.log('PageFilter =====>', this.pageFilter)
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
      qualityNotificationTypeId: null,
      plantId: this.pageFilter.plantId,
      qualityNotificationTypeCode: null,
      text: null,
      query: null,
      orderByProperty: 'qualityNotificationTypeId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-notification-type',
      accept: () => {
          this._qualityNotificationTypeService.delete(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.qualityNotificationTypes = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            }).catch(error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.qualityNotificationTypes = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
