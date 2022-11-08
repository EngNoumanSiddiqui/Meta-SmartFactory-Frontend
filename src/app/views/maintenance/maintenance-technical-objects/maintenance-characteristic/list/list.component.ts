/**
 * Created by reis on 29.07.2019.
 */
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../../../environments/environment';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {ConvertUtil} from '../../../../../util/convert-util';
import {CharacteristicService} from '../../../../../services/dto-services/maintenance-equipment/characteristic.service';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {AppStateService} from '../../../../../services/dto-services/app-state.service';

@Component({
  selector: 'characteristic-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListCharacteristicComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };


  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'maintenanceCharacteristicId', header: 'characteristic-id'},
    // {field: 'characteristic', header: 'characteristic'},
    {field: 'caseSensitive', header: 'case-sensitive'},
    {field: 'decimalPlaces', header: 'decimal-places'},
    {field: 'description', header: 'description'},
    {field: 'numberOfCharacters', header: 'number-of-character'},
    {field: 'unitMeasure', header: 'unit-of-measures'},
    {field: 'validFrom', header: 'valid-from'},
    {field: 'maintenanceCharacteristicDataType', header: 'data-type'},
    {field: 'negativeValuesAllowed', header: 'negative-values-allowed'}
  ];
  cols = [
    {field: 'maintenanceCharacteristicId', header: 'characteristic-id'},
    {field: 'characteristic', header: 'characteristic'},
    {field: 'caseSensitive', header: 'case-sensitive'},
    {field: 'decimalPlaces', header: 'decimal-places'},
    {field: 'description', header: 'description'},
    {field: 'numberOfCharacters', header: 'number-of-character'},
    {field: 'unitMeasure', header: 'unit-of-measures'},
    {field: 'validFrom', header: 'valid-from'},
    {field: 'maintenanceCharacteristicDataType', header: 'data-type'},
    {field: 'negativeValuesAllowed', header: 'negative-values-allowed'}
  ];
  modal = {active: false};
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    caseSensitive: null,
    characteristic: null,
    characteristicDataTypeId: null,
    characteristicDataTypeName: null,
    createDate: null,
    decimalPlaces: null,
    description: null,
    equipmentMeasuringPointId: null,
    maintenanceCharacteristicId: null,
    negativeValuesAllowed: null,
    numberOfCharacters: null,
    query: null,
    unitMeasure: null,
    validFrom: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    plantId: null
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  private searchTerms = new Subject<any>();

  sub: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private characteristicSvc: CharacteristicService,
              private appStateSvc: AppStateService) {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
      }
      this.filter(this.pageFilter);
    });
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.characteristicSvc.filterObservable(this.pageFilter))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.tableData = [];
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );

    this.filter(this.pageFilter);
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
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
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }


  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
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
    this.search(this.pageFilter)
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      caseSensitive: null,
      characteristic: null,
      characteristicDataTypeId: null,
      characteristicDataTypeName: null,
      createDate: null,
      decimalPlaces: null,
      description: null,
      equipmentMeasuringPointId: null,
      maintenanceCharacteristicId: null,
      negativeValuesAllowed: null,
      numberOfCharacters: null,
      query: null,
      unitMeasure: null,
      validFrom: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      plantId: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.characteristicSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}
