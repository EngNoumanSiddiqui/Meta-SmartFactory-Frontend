import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SamplingProcedureService } from 'app/services/dto-services/sampling-procedure/sampling-procedure.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListSamplingProcedure implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  samplingProcedureModal = {
    modal: null,
    data: null,
    id: null
  };
  sub: Subscription;

  selectedColumns = [
    { field: 'samplingProcedureId', header: 'sampling-procedure-id', index: 1 },
    { field: 'samplingProcedureCode', header: 'sampling-procedure-code', index: 2 },
    { field: 'samplingProcedureName', header: 'sampling-procedure', index: 3 },
    { field: 'samplingType', header: 'sampling-type', index: 4 },
    { field: 'valuationMode', header: 'valuation-mode', index: 5 },
    { field: 'samplingProcedureInspectionPoint', header: 'inspection-points', index: 6 },
    { field: 'usageIndicator', header: 'usage-indicator', index: 7 },
    { field: 'sampleSize', header: 'sample-size', index: 8 },
    { field: 'acceptance', header: 'acceptance-number', index: 9 }
  ];
  cols = [
    { field: 'samplingProcedureId', header: 'sampling-procedure-id', index: 1 },
    { field: 'samplingProcedureCode', header: 'sampling-procedure-code', index: 2 },
    { field: 'samplingProcedureName', header: 'sampling-procedure', index: 3 },
    { field: 'samplingType', header: 'sampling-type', index: 4 },
    { field: 'valuationMode', header: 'valuation-mode', index: 5 },
    { field: 'samplingProcedureInspectionPoint', header: 'inspection-points', index: 6 },
    { field: 'usageIndicator', header: 'usage-indicator', index: 7 },
    { field: 'sampleSize', header: 'sample-size', index: 8 },
    { field: 'acceptance', header: 'acceptance-number', index: 9 }
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
    createDate: null,
    samplingProcedureId: null,
    acceptance: null,
    sampleSize: null,
    samplingProcedureCode: null,
    samplingProcedureName: null,
    samplingProcedureInspectionPointId: null,
    samplingProcedureValuationModeId: null,
    samplingTypeId: null,
    updateDate: null,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  samplingProcedures = [];
  selectedSamplingProcedures = [];
  modal = { active: false };
  display = false;
  samplingTypes = [
    {id: 1, name: 'Sample1'},
    {id: 2, name: 'Sample2'},
  ];

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.samplingProcedureModal.id = id;
    this.samplingProcedureModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.samplingProcedureModal.modal = mod;
    this.samplingProcedureModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.samplingProcedureModal.modal = 'NEW';
      myModal.show();
    }
    this.samplingProcedureModal.id = null;
    this.isSaveAndNew = false;
    this.selectedSamplingProcedures = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _samplingProcedure: SamplingProcedureService,
    private appStateService: AppStateService,
    public plantService: PlantService
  ) {
    
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._samplingProcedure.filterSamplingProcedureObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.samplingProcedures = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.samplingProcedures = [];
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
      createDate: null,
      samplingProcedureId: null,
      acceptance: null,
      sampleSize: null,
      samplingProcedureCode: null,
      samplingProcedureName: null,
      samplingProcedureInspectionPointId: null,
      samplingProcedureValuationModeId: null,
      samplingTypeId: null,
      updateDate: null,
      plantId: null,
      plantName: null,
      query: null,
      orderByProperty: 'samplingProcedureId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'sampling-procedure',
      accept: () => {
          this._samplingProcedure.deleteSamplingProcedure(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.samplingProcedures = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.samplingProcedures = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
