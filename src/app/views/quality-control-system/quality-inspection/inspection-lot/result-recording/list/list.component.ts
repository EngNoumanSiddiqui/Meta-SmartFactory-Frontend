import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ResultRecordingService } from 'app/services/dto-services/quality-inspection/result-recording/result-recording.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';

import { switchMap, debounceTime } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';
@Component({
  selector: 'list-result-recording',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListResultRecording implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  resultRecordingModal = {
    modal: null,
    data: null,
    id: null
  };
  @Input('qualityInspectionLotId') set setqualityInspectionLotId(qualityInspectionLotId) {
    if (qualityInspectionLotId) {
      this.pageFilter.qualityInspectionLotId = qualityInspectionLotId;
    }
  }
  anyRecordSelected: boolean = false;
  sub: Subscription;

  selectedColumns = [
    // { field: 'resultRecordingId', header: 'Result Recording Id' },
    { field: 'qualityInspectionCharacteristic', header: 'Inspection Characteristic' },
    { field: 'recordType', header: 'Record Type' },
    { field: 'specifications', header: 'Specifications' },
    { field: 'inspect', header: 'Inspect' },
    { field: 'inspected', header: 'Inspected' },
    { field: 'result', header: 'Result' },
    { field: 'defect', header: 'Defect' },
    { field: 'attribute', header: 'Attribute' },
    { field: 'inspectionDescription', header: 'Inspection Description' },
    { field: 'valuation', header: 'Valuation' },

  ];
  cols = [
    { field: 'resultRecordingId', header: 'Result Recording Id' },
    { field: 'inspectionCharacteristic', header: 'Inspection Characteristic' },
    { field: 'recordType', header: 'Record Type' },
    { field: 'specifications', header: 'Specifications' },
    { field: 'inspect', header: 'Inspect' },
    { field: 'inspected', header: 'Inspected' },
    { field: 'result', header: 'Result' },
    { field: 'defect', header: 'Defect' },
    { field: 'attribute', header: 'Attribute' },
    { field: 'inspectionDescription', header: 'Inspection Description' },
    { field: 'valuation', header: 'Valuation' },

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
    createDate: null,
    inspect: null,
    plantId: null,
    inspected: null,
    inspectionCharacteristicShortText: null,
    inspectionlotResultRecordingCode: null,
    inspectionlotResultRecordingId: null,
    orderByDirection: 'desc',
    orderByProperty: 'inspectionlotResultRecordingId',
    qualityInspectionCharacteristicId: null,
    qualityInspectionLotId: null,
    qualitySamplingProcedureId: null,
    query: null,
    result: null,
    specifications: null,
    updateDate: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
  };

  classReOrder = ['asc', 'asc'];

  resultRecordings = [];
  selectedResultRecordings = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();

  modalShow(id, mod: string) {
    this.resultRecordingModal.id = id;
    this.resultRecordingModal.modal = mod;
    this.modal.active = true;
  }

  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _resultRecordingService: ResultRecordingService,
  ) {
   
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._resultRecordingService.filterResultRecordingObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.resultRecordings = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.resultRecordings = [];
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
      createDate: null,
      inspect: null,
      inspected: null,
      inspectionCharacteristicShortText: null,
      inspectionlotResultRecordingCode: null,
      inspectionlotResultRecordingId: null,
      orderByDirection: 'desc',
      orderByProperty: 'inspectionlotResultRecordingId',
      qualityInspectionCharacteristicId: null,
      qualityInspectionLotId: null,
      qualitySamplingProcedureId: null,
      plantId: this.pageFilter.plantId,
      query: null,
      result: null,
      specifications: null,
      updateDate: null,
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize)
        ? Number(environment.filterRowSize)
        : 10,
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'result-recording',
      accept: () => {
          this._resultRecordingService.deleteResultRecording(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.resultRecordings = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.resultRecordings = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
