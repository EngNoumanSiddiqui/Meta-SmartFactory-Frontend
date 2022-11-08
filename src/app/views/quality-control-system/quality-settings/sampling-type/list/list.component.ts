import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';

@Component({ 
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListSamplingType implements OnInit {

  samplingTypeModal = {
    modal: null,
    data: null,
    id: null
  };
  sub: Subscription;

  selectedColumns = [
    { field: 'samplingTypeId', header: 'sampling-Type-id',index:1 },
    { field: 'samplingTypeCode', header: 'sampling-type-code', index:2},
    { field: 'samplingTypeText', header: 'sampling-type-text', index:3}
  ];
  cols = [
    { field: 'samplingTypeId', header: 'sampling-Type-id', index:1 },
    { field: 'samplingTypeCode', header: 'sampling-type-code', index:2 },
    { field: 'samplingTypeText', header: 'sampling-type-text', index:3}
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
    samplingTypeId: null,
    samplingTypeCode: null,
    description: null,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc'];

  samplingTypes = [];
  selectedsamplingTypes = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.samplingTypeModal.id = id;
    this.samplingTypeModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.samplingTypeModal.modal = mod;
    this.samplingTypeModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.samplingTypeModal.modal = 'NEW';
      myModal.show();
    }
    this.samplingTypeModal.id = null;
    this.isSaveAndNew = false;
    this.selectedsamplingTypes = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _SamplingTypeService: SamplingTypeService,
    private appStateService: AppStateService
  ) {
    
  }

  ngOnInit() {
    this.samplingTypes = [];
    // this.loaderService.showLoader();


    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._SamplingTypeService.filterSamplingType(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.samplingTypes = result['content'];
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
        this.samplingTypes = [];
      }
    );
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      }
      
    });
    // this.filter(this.pageFilter);
    
    // this._SamplingTypeService.filterSamplingType(this.pageFilter).then(
    //   result => {
    //     this.loaderService.hideLoader();
    //     this.pagination.currentPage = result['currentPage'];
    //     this.pagination.totalElements = result['totalElements'];
    //     this.pagination.totalPages = result['totalPages'];
    //     this.samplingTypes = result['content'];
    //     this.filter(this.pageFilter);
    //   },
    //   error => {
    //     this.utilities.showErrorToast(error);
    //     this.loaderService.hideLoader();
    //     this.samplingTypes = [];
    //   }
    // );
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
      samplingTypeId: null,
      samplingTypeCode: null,
      description: null,
      plantId: null,
      plantName: null,
      query: null,
      orderByProperty: 'samplingTypeId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'inspection-method',
      accept: () => {
          this._SamplingTypeService.deleteSamplingType(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.samplingTypes = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.samplingTypes = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
