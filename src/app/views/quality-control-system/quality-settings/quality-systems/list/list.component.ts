import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListQualitySystems implements OnInit {

  qualitySystemModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'qualitySystemId', header: 'quality-system-id', index: 1 },
    { field: 'qualitySystemCode', header: 'quality-system-code', index: 2 },
    { field: 'qualitySystemText', header: 'quality-system-name', index: 3 },
  ];
  cols = [
    { field: 'qualitySystemId', header: 'quality-system-id', index: 1 },
    { field: 'qualitySystemCode', header: 'quality-system-code', index: 2 },
    { field: 'qualitySystemText', header: 'quality-system-name', index: 3 },
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
    qualitySystemId: null,
    qualitySystemCode: null,
    qualitySystemText: null,
    plantId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc'];

  qualitySystems = [];
  selectedQualitySystems = [];
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
    this.qualitySystemModal.id = id;
    this.qualitySystemModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.qualitySystemModal.modal = mod;
    this.qualitySystemModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.qualitySystemModal.modal = 'NEW';
      myModal.show();
    }
    this.qualitySystemModal.id = null;
    this.isSaveAndNew = false;
    this.selectedQualitySystems = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _qualitySystemsService: QualitySystemsService
  ) { }

  ngOnInit() {
    this.qualitySystems = [];
    // this.loaderService.showLoader();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._qualitySystemsService.filter(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.qualitySystems = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.utilities.showErrorToast(error)
          this.loaderService.hideLoader();
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
    if (item === 'qualitySystemName') {
      this.classReOrder[id] = null
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
      pageSize: this.pageFilter.pageSize,
      qualitySystemId: null,
      qualitySystemCode: null,
      plantId: this.pageFilter.plantId,
      qualitySystemText: null,
      query: null,
      orderByProperty: 'qualitySystemId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-systems',
      accept: () => {
        this._qualitySystemsService.delete(id).then(
          result => {
            this.pagination.currentPage = result['currentPage'];
            this.pagination.totalElements = result['totalElements'];
            this.pagination.totalPages = result['totalPages'];
            this.qualitySystems = result['content'];
            this.loaderService.hideLoader();

            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          }).catch(error => {
            this.utilities.showErrorToast(error);
            this.loaderService.hideLoader();
            this.qualitySystems = [];
          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
