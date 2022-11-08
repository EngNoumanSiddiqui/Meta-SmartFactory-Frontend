import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';
import { UsageDecisionTypeService } from 'app/services/dto-services/usage-decision-type/usage.decision.type.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListUsageDecisionType implements OnInit {

  defectTypeModal = {
    modal: null,
    data: null,
    id: null
  };

  sub: Subscription;

  selectedColumns = [
    { field: 'qmQualityUsageDecisionTypeId', header: 'ud_type_id', index: 1 },
    { field: 'qmQualityUsageDecisionTypeCode', header: 'ud_type_code', index: 2 },
    { field: 'qmQualityUsageDecisionTypeDescription', header: 'ud_type_description', index: 3 },
  ];

  cols = [
    { field: 'qmQualityUsageDecisionTypeId', header: 'ud_type_id', index: 1 },
    { field: 'qmQualityUsageDecisionTypeCode', header: 'ud_type_code', index: 2 },
    { field: 'qmQualityUsageDecisionTypeDescription', header: 'ud_type_description', index: 3 },
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
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: 'qmQualityUsageDecisionTypeId',
    orderByDirection: 'desc',
    createDate: null,
    qmQualityUsageDecisionTypeCode: null,
    qmQualityUsageDecisionTypeDescription: null,
    qmQualityUsageDecisionTypeId: null,
    updateDate: null
  };

  classReOrder = ['asc', 'asc'];

  defectTypes = [];

  selectedDefectTypes = [];

  modal = { active: false };

  display = false;

  private searchTerms = new Subject<any>();

  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.defectTypeModal.id = id;
    this.defectTypeModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.defectTypeModal.modal = mod;
    this.defectTypeModal.data = data[0].stockId;
    this.modal.active = true;
  }

  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.defectTypeModal.modal = 'NEW';
      myModal.show();
    }
    this.defectTypeModal.id = null;
    this.isSaveAndNew = false;
    this.selectedDefectTypes = null;
  }

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private _loaderService: LoaderService,
    private _utilities: UtilitiesService,
    private _appStateService: AppStateService,
    private _usageDecisionTypeService: UsageDecisionTypeService
  ) {
    this.sub = this._appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
      }
      this.filter(this.pageFilter);
    });
  }

  ngOnInit() {
    this.defectTypes = [];
    this._loaderService.showLoader();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._usageDecisionTypeService.filter(term))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.defectTypes = result['content'];
          this._loaderService.hideLoader();
        },
        error => {
          this._utilities.showErrorToast(error)
          this._loaderService.hideLoader();
        }
      );
    // console.log('PageFilter =====>', this.pageFilter)
    this.filter(this.pageFilter);

  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this._loaderService.showLoader();
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
      pageSize: Number(environment.filterRowSize)
        ? Number(environment.filterRowSize)
        : 10,
      plantId: null,
      plantName: null,
      query: null,
      orderByProperty: 'qmQualityUsageDecisionTypeId',
      orderByDirection: 'desc',
      createDate: null,
      qmQualityUsageDecisionTypeCode: null,
      qmQualityUsageDecisionTypeDescription: null,
      qmQualityUsageDecisionTypeId: null,
      updateDate: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    console.log('@id', id)
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'usage-decision-type',
      accept: () => {
        this._usageDecisionTypeService.delete(id).then(
          result => {
            this._loaderService.hideLoader();
            this._utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          },
          error => {
            this._utilities.showErrorToast(error);
            this._loaderService.hideLoader();
            this.defectTypes = [];
          });
      },
      reject: () => {
        this._utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
