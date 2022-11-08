import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DefectRecordingService } from 'app/services/dto-services/quality-inspection/defect-recording/defect-recording.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';
@Component({
  selector: 'list-defect-recording',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListDefectRecording implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @Input('selectedInspectionLot') selectedInspectionLot;

  defectRecordingModal = {
    modal: null,
    data: null,
    id: null
  };
  anyRecordSelected: boolean = false;
  sub: Subscription;

  selectedColumns = [
    { field: 'defectRecordingId', header: 'defect-recording-id' },
    { field: 'defectRecordingCode', header: 'defect-recording-code' },
    { field: 'stock', header: 'material' },
    { field: 'qualityInspectionOperation', header: 'inspection-operation' },
    { field: 'qualityInspectionCharacteristic', header: 'inspection-characteristic' },
    { field: 'qualityDefectType', header: 'defect-type' },
    // { field: 'qualityCodeGroup', header: 'code-group' }
  ];
  cols = [
    { field: 'defectRecordingId', header: 'defect-recording-id' },
    { field: 'defectRecordingCode', header: 'defect-recording-code' },
    { field: 'qualityDefectType', header: 'defect-type' },
    { field: 'qualityInspectionCharacteristic', header: 'inspection-characteristic' },
    { field: 'qualityInspectionOperation', header: 'inspection-operation' },
    { field: 'stock', header: 'material' }
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
    defectRecordingId: null,
    inspectionCharacteristic: null,
    reportType: null,
    catalog: null,
    codeGroup: null,
    defectType: null,
    inspector: null,
    shortText: null,
    selected: false,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  defectRecordings = [];
  selectedDefectRecordings = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.defectRecordingModal.id = id;
    this.defectRecordingModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.defectRecordingModal.modal = mod;
    this.defectRecordingModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.defectRecordingModal.modal = 'NEW';
      myModal.show();
    }
    this.defectRecordingModal.id = null;
    this.isSaveAndNew = false;
    this.selectedDefectRecordings = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _defectRecordingService: DefectRecordingService,
    private appStateService: AppStateService
  ) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
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
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._defectRecordingService.filterDefectRecordingObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.defectRecordings = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.defectRecordings = [];
      }
    );
    this.filter(this.pageFilter);
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
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      defectRecordingId: null,
      inspectionCharacteristic: null,
      reportType: null,
      catalog: null,
      codeGroup: null,
      defectType: null,
      inspector: null,
      shortText: null,
      selected: false,
      plantId: null,
      plantName: null,
      query: null,
      orderByProperty: 'defectRecordingId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'defect-recording',
      accept: () => {
          this._defectRecordingService.deleteDefectRecording(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.defectRecordings = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.defectRecordings = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  // on select any row, record buttons should be active.
  onRecordSelectAll(event) {
    event.checked? this.defectRecordings.map(item => item.selected = true):
        this.defectRecordings.map(item => item.selected = false);
    this.enableButtons();
  }

  onRecordSelect(event) {
    this.defectRecordings.map(item=>{
      if(item.defectRecordingId === event.data.defectRecordingId) { item.selected = true;}
    });
    this.enableButtons();
  }

  onRecordDeselect(event) {
    this.defectRecordings.map(item=>{
      if(item.defectRecordingId === event.data.defectRecordingId) { item.selected = false;}
    });
    this.enableButtons();
  }

  enableButtons() {
    let counter = 0;
    this.defectRecordings.map(item=>{
      if(item.selected === true) counter ++;
    });
    if( counter === 1 ){ this.anyRecordSelected = true;}
    else {this.anyRecordSelected = false;}

  }
}
