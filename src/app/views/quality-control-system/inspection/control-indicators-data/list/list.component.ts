import {Component, OnInit, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Subject, Subscription} from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ControlIndicatorDataService } from 'app/services/dto-services/inspection-charateristics/control-indicator-data/controlIndicatorData.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: "list-control-indicator-data",
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListControlIndicatorDataComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() saveEvent = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input('isUpperLimitChecked') isUpperLimitChecked: boolean;

  // tslint:disable-next-line: no-input-rename
  @Input('qualityCharacteristicControlIndicatorId') qualityCharacteristicControlIndicatorId: any;
  // tslint:disable-next-line: no-input-rename
  controlIndicatorDataModal = {
    modal: null,
    data: null,
    id: null
  };
  sub: Subscription;

  selectedColumns = [
    { field: 'characteristicControlIndicatorDataId', header: 'Characteristic Control Indicator Data Id',index:1 },
    { field: 'characteristicControlIndicatorDataCode', header: 'Characteristic Control Indicator Data Code', index:2 },
    { field: 'decimalPlaces', header: 'Decimal Places', index:3 },
    { field: 'decimalPlacesUnit', header: 'Decimal Places Unit', index:4 },
    { field: 'lowerSpecificLimit', header: 'Lower Specific Limit', index:5 },
    { field: 'upperLimit', header: 'Upper Limit', index:6 },
    { field: 'targetValue', header: 'Target Value', index:7 }
  ];
  cols = [
    { field: 'characteristicControlIndicatorDataId', header: 'Characteristic Control Indicator Data Id',index:1 },
    { field: 'characteristicControlIndicatorDataCode', header: 'Characteristic Control Indicator Data Code', index:2 },
    { field: 'decimalPlaces', header: 'Decimal Places', index:3 },
    { field: 'decimalPlacesUnit', header: 'Decimal Places Unit', index:4 },
    { field: 'lowerSpecificLimit', header: 'Lower Specific Limit', index:5 },
    { field: 'upperLimit', header: 'Upper Limit', index:6 },
    { field: 'targetValue', header: 'Target Value', index:7 }
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
    characteristicControlIndicatorDataCode: null,
    characteristicControlIndicatorDataId: null,
    createDate: null,
    decimalPlaces: null,
    decimalPlacesUnit: null,
    lowerSpecificLimit: null,
    qualityCharacteristicControlIndicatorId: null,
    query: null,
    targetValue: null,
    updateDate: null,
    upperLimit: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  controlIndicatorsData = [];
  selectedControlIndicatorsData = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;
  selectedItemIndex: any;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string, rowData?:any, rowIndex?: number) {
    this.controlIndicatorDataModal.id = id;
    this.controlIndicatorDataModal.modal = mod;
    this.controlIndicatorDataModal.data = rowData;
    this.selectedItemIndex = rowIndex;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.controlIndicatorDataModal.modal = mod;
    this.controlIndicatorDataModal.data = data[0].stockId;
    this.modal.active = true;
  }
  // onSaveSuccessful(event, myModal) {
  //   myModal.hide();
  //   this.filter(this.pageFilter);
  //   if (this.isSaveAndNew) {
  //     this.modal.active = true;
  //     this.controlIndicatorDataModal.modal = 'NEW';
  //     myModal.show();
  //   }
  //   this.controlIndicatorDataModal.id = null;
  //   this.isSaveAndNew = false;
  //   this.selectedControlIndicatorsData = null;
  // }
  onSaveControlIndicator (event, myModal) {
    if ( typeof event === 'object') {
      this.controlIndicatorsData.push(event);
      this.modal.active = false;
    }
  }

  onEditControlIndicator(event, myModal) {
    if ( typeof event === 'object') {
      this.controlIndicatorsData[this.selectedItemIndex] = event;
      this.modal.active = false;
    }
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _controlIndicatorData: ControlIndicatorDataService,
  ) {

  }

  ngOnInit() {
    this.pageFilter.qualityCharacteristicControlIndicatorId = this.qualityCharacteristicControlIndicatorId;
    this.controlIndicatorsData = [];
    this.loaderService.showLoader();
    this._controlIndicatorData.filterControlIndicatorData(this.pageFilter).then(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.controlIndicatorsData = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.controlIndicatorsData = [];
      }
    );

    this.filter(this.pageFilter);
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
    this.selectedColumns.sort(function (a: any, b: any) {
      return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
    });
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
      characteristicControlIndicatorDataCode: null,
      characteristicControlIndicatorDataId: null,
      createDate: null,
      decimalPlaces: null,
      decimalPlacesUnit: null,
      lowerSpecificLimit: null,
      qualityCharacteristicControlIndicatorId: this.qualityCharacteristicControlIndicatorId,
      query: null,
      targetValue: null,
      updateDate: null,
      upperLimit: null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'control-indicator-data',
      accept: () => {
          this._controlIndicatorData.deleteControlIndicatorData(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.controlIndicatorsData = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.controlIndicatorsData = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }


  onTableDataChange() {
    this.saveEvent.next(this.controlIndicatorsData);
  }


  addOrUpdate(item) {
    if (this.controlIndicatorDataModal.data) {// edit event
      this.controlIndicatorsData.splice(this.controlIndicatorsData.findIndex(itm => itm.characteristicControlIndicatorDataId === this.controlIndicatorDataModal.data.characteristicControlIndicatorDataId),
        1,
        item);
    } else {// new event
      this.controlIndicatorsData = [item, ...this.controlIndicatorsData];
    }
    this.onTableDataChange();
  }
}
