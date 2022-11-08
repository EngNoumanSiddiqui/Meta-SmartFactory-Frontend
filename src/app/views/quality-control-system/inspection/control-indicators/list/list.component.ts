import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorService } from 'app/services/dto-services/inspection-charateristics/control-indicator/controlIndicator.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';


@Component({
  selector: 'list-control-indicator',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListControlIndicator implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() saveEvent = new EventEmitter();

  @Input() inspectionCharacteristicId: any;
  selectedItemIndex: number;

  @Input('qualityCharacteristicControlIndicatorList') set setList(qualityCharacteristicControlIndicatorList) {
    if (qualityCharacteristicControlIndicatorList) {
      this.controlIndicators = qualityCharacteristicControlIndicatorList;
    }
  }

  controlIndicatorModal = {
    modal: null,
    data: null,
    id: null
  };
  sub: Subscription;

  selectedColumns = [
    { field: 'characteristicControlIndicatorId', header: 'Control Indicator Id'},
    { field: 'characteristicControlIndicatorCode', header: 'Control Indicator Code'},
    { field: 'qualityCharacteristicControlIndicatorType', header: 'Type'},
    { field: 'qualityControlIndicatorResultId', header: 'control-indicator-result'},
    { field: 'qualityControlIndicatorSampleId', header: 'control-indicator-sample'},
    // { field: 'createDate', header: 'create-date'},
    // { field: 'updateDate', header: 'update-date'}
  ];
  cols = [
    { field: 'characteristicControlIndicatorId', header: 'Control Indicator Id'},
    { field: 'characteristicControlIndicatorCode', header: 'Control Indicator Code'},
    { field: 'qualityCharacteristicControlIndicatorType', header: 'Type'},
    { field: 'qualityControlIndicatorResultId', header: 'control-indicator-result'},
    { field: 'qualityControlIndicatorSampleId', header: 'control-indicator-sample'},
    // { field: 'createDate', header: 'create-date'},
    // { field: 'updateDate', header: 'update-date'}
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
    'characteristicControlIndicatorCode': null,
    'controlIndicatorResult': null,
    'controlIndicatorSample': null,
    'controlIndicatorType': null,
    'defectRecording': null,
    'orderByDirection': 'desc',
    'orderByProperty': 'characteristicControlIndicatorCode',
    'query': null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  controlIndicators = [];
  selectedControlIndicators = [];
  modal = { active: false };
  display = false;
  inspCharsTypes = [
    {id: 1, name: 'TempType1'},
    {id: 2, name: 'TempType2'},
  ];
  inspCharsStatus = [
    {id: 1, name: 'TempStatus1'},
    {id: 2, name: 'TempStatus2'},
  ];

  private searchTerms = new Subject<any>();
  
  // isSaveAndNew: boolean;

  // SaveActionFire(isSaveAndNew: boolean) {
  //   this._actSvc.saveAction$.next();
  //   this.isSaveAndNew = isSaveAndNew;
  // }

  modalShow(id, mod: string, rowData?, rowindex?: number) {
    this.controlIndicatorModal.id = id;
    this.controlIndicatorModal.modal = mod;
    this.controlIndicatorModal.data = rowData;
    this.modal.active = true;
    this.selectedItemIndex = rowindex;
  }

  onSaveControlIndicator (event, myModal) {
    if ( typeof event === 'object') {
      this.controlIndicators.push(event);
      this.modal.active = false;
    }
  }

  onEditControlIndicator(event, myModal) {
    if ( typeof event === 'object') {
      this.controlIndicators[this.selectedItemIndex] = event;
      this.modal.active = false;
    }
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _controlIndicator: ControlIndicatorService
  ) {}

  ngOnInit() {

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

    // this.search(this.pageFilter);
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    // this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize)
        ? Number(environment.filterRowSize)
        : 10,
      'characteristicControlIndicatorCode': null,
      'controlIndicatorResult': null,
      'controlIndicatorSample': null,
      'controlIndicatorType': null,
      'defectRecording': null,
      'orderByDirection': 'desc',
      'orderByProperty': 'characteristicControlIndicatorCode',
      'query': null
    };
    // this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'control-indicator',
      accept: () => {
          this._controlIndicator.delete(id).subscribe(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.controlIndicators = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.controlIndicators = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }


  onTableDataChange() {
    this.saveEvent.next(this.controlIndicators);
  }


  addOrUpdate(item) {
    if (this.controlIndicatorModal.data) {// edit event
      this.controlIndicators.splice(this.controlIndicators.findIndex(itm => itm.characteristicControlIndicatorId === this.controlIndicatorModal.data.characteristicControlIndicatorId),
        1,
        item);
    } else {// new event
      this.controlIndicators = [item, ...this.controlIndicators];
    }
    this.onTableDataChange();
  }

}
