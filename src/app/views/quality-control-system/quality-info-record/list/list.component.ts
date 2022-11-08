import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { debounceTime, switchMap } from 'rxjs/operators';
@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListQualityInfoRecords implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  qualityInfoRecordModal = {
    modal: null,
    data: null,
    id: null
  };
  lotCreatedOn;
  lotCreatedTo;
  listSettings;
  anyRecordSelected: boolean = false;

  selectedColumns = [
    { field: 'qualityInfoRecordId', header: 'quality-info-record-id', index: 1 },
    { field: 'qualityInfoRecordCode', header: 'quality-info-record-code', index: 2 },
    { field: 'materialNo', header: 'material-no', index: 3 },
    { field: 'materialName', header: 'material-name', index: 4 },
    { field: 'plant', header: 'plant', index: 5 },
    { field: 'vendor', header: 'vendor', index: 6 },
    { field: 'releaseDate', header: 'release-date', index: 7 }
  ];
  cols = [
    { field: 'qualityInfoRecordId', header: 'quality-info-record-id', index: 1 },
    { field: 'qualityInfoRecordCode', header: 'quality-info-record-code', index: 2 },
    { field: 'materialNo', header: 'material-no', index: 3 },
    { field: 'materialName', header: 'material-name', index: 4 },
    { field: 'plant', header: 'plant', index: 5 },
    { field: 'vendor', header: 'vendor', index: 6 },
    { field: 'releaseDate', header: 'release-date', index: 7 },
    { field: 'releaseQuantity', header: 'release-quantity', index: 8 },
    { field: 'quantityUnit', header: 'quantity-unit', index: 9 },
    { field: 'blockFunction', header: 'block-function', index: 10 },
    { field: 'blockReason', header: 'block-reason', index: 10 },
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
    orderByProperty: 'qualityInfoRecordId',
    orderByDirection: 'desc',
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    plantName: null,
    releaseDate: null,
    blockFunction: null,
    purchaseOrderId: null,
    qualityInfoRecordCode: null,
    qualityInfoRecordId: null,
    query: null,
    stockId: null,
    stockName: null,
    stockNo: null,
    updateDate: null,
    vendorId: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];


  blockFunctionLists = [
    { id: 1, name: 'Block purchase order' },
    { id: 2, name: 'Block quot. request and purchase order' },
    { id: 3, name: 'Block quot. req., order, goods receipt' },
    { id: 4, name: 'Block source determination' },
    { id: 5, name: 'Total block' },

  ];

  qualityInfoRecords = [];
  selectedQualityInfoRecords = [];
  modal = { active: false };
  display = false;
  sub: Subscription;


  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.qualityInfoRecordModal.id = id;
    this.qualityInfoRecordModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.qualityInfoRecordModal.modal = mod;
    this.qualityInfoRecordModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.qualityInfoRecordModal.modal = 'NEW';
      myModal.show();
    }
    this.qualityInfoRecordModal.id = null;
    this.isSaveAndNew = false;
    this.selectedQualityInfoRecords = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityInfoRecordService: QualityInfoRecordService,
    private appStateService: AppStateService,
    public plantService: PlantService
  ) {
    
  }

  ngOnInit() {
    this.qualityInfoRecords = [];
    this.loaderService.showLoader();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._qualityInfoRecordService.filterRecord(term))).subscribe(
        (result: any) => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.qualityInfoRecords = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.qualityInfoRecords = [];
          this.utilities.showErrorToast(error);
          this.loaderService.hideLoader();
        }
      );

    // this.filter(this.pageFilter);

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
    // this.loaderService.showLoader();
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
    if (item === 'vendor' || item === 'releaseDate') {
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
      createDate: null,
      orderByProperty: 'qualityInfoRecordId',
      orderByDirection: 'desc',
      pageNumber: 1,
      blockFunction: null,
      releaseDate: null,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      plantId: null,
      plantName: null,
      purchaseOrderId: null,
      qualityInfoRecordCode: null,
      qualityInfoRecordId: null,
      query: null,
      stockId: null,
      stockName: null,
      stockNo: null,
      updateDate: null,
      vendorId: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-info-record',
      accept: () => {
        this._qualityInfoRecordService.deleteRecord(id).then(
          result => {
            // this.pagination.currentPage = result['currentPage'];
            // this.pagination.totalElements = result['totalElements'];
            // this.pagination.totalPages = result['totalPages'];
            // this.qualityInfoRecords = result['content'];
            this.loaderService.hideLoader();

            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          },
          error => {
            this.utilities.showErrorToast(error);
            this.loaderService.hideLoader();
            this.qualityInfoRecords = [];
          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  // on select any row, record buttons should be active.
  onRecordSelectAll(event) {
    event.checked ? this.qualityInfoRecords.map(item => item.selected = true) :
      this.qualityInfoRecords.map(item => item.selected = false);
  }

  onRecordSelect(event) {
    this.qualityInfoRecords.map(item => {
      if (item.qualityInfoRecordId === event.data.qualityInfoRecordId) { item.selected = true; }
    });
  }

  onRecordDeselect(event) {

    this.qualityInfoRecords.map(item => {
      if (item.qualityInfoRecordId === event.data.qualityInfoRecordId) { item.selected = false; }
    });
  }
}
