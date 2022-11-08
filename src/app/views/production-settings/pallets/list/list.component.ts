import { AppStateService } from 'app/services/dto-services/app-state.service';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, Message} from 'primeng';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
@Component({
  selector: 'pallet-setting-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPalletComponent implements OnInit , OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  palletModal = {
    modal: null,
    id: null
  };

  selectedPallets;
  msgs: Message[] = [];
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    operationId: null,
    operationName: null,
    palletCode: null,
    palletId: null,
    palletName: null,
    palletSettingId: null,
    plantId: null,
    plantName: null,
    currentStockQuantity: null,
    query: null,
    wareHouseId: null,
    wareHouseName: null,
    orderByProperty: 'palletId',
    orderByDirection: 'desc'
  };
  showLoader = false;
  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  pallets = [];

  selectedColumns = [
    {field: 'palletSettingId', header: 'pallet-setting-id'},
    {field: 'palletName', header: 'pallet-name'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'operation', header: 'operation'},
    {field: 'height', header: 'height'},
    {field: 'width', header: 'width'},
    {field: 'maxQuantity', header: 'max-quantity'},
    {field: 'minQuantity', header: 'min-quantity'},
    {field: 'reservedStockQuantity', header: 'reserved-quantity'},
    {field: 'currentStockQuantity', header: 'current-stock-quantity'},
    
  ];
  cols = [
    {field: 'palletSettingId', header: 'pallet-setting-id'},
    {field: 'palletName', header: 'pallet-name'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'operation', header: 'operation'},
    {field: 'height', header: 'height'},
    {field: 'width', header: 'width'},
    {field: 'maxQuantity', header: 'max-quantity'},
    {field: 'minQuantity', header: 'min-quantity'},
    
    {field: 'reservedStockQuantity', header: 'reserved-quantity'},
    {field: 'currentStockQuantity', header: 'current-stock-quantity'},
    {field: 'variety', header: 'variety'},
    {field: 'maxBoxQuantity', header: 'max-box-quantity'},
    {field: 'requirementPalletQuantityForForklift', header: 'requirement-pallet-quantity-for-forklift'},
  ];
  private searchTerms = new Subject<any>();

  sub: Subscription;
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }
  modalShow(id, mod: string) {

    this.palletModal.id = id;
    this.palletModal.modal = mod;

    this.myModal.show();
  }
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _palletSettingSvc: PalletSettingsService,
              private utilities: UtilitiesService,
              private appStateSvc: AppStateService,
              private loaderService: LoaderService) {
                this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
                  if ((res) && res.plantId) {
                    this.pageFilter.plantName = res.plantName;
                    this.pageFilter.plantId = res.plantId;
                  } else {
                    this.pageFilter.plantName = null;
                    this.pageFilter.plantId = null;
                  }
                  this.search(this.pageFilter);
                });

  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._palletSettingSvc.filterObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.pallets = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.pallets = [];
        this.utilities.showErrorToast(error)
      }
    );
    this.filter(this.pageFilter);
  }

  ngOnDestroy() {
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
      operationId: null,
      operationName: null,
      palletCode: null,
      currentStockQuantity: null,
      palletId: null,
      palletName: null,
      palletSettingId: null,
      plantId: null,
      plantName: null,
      query: null,
      wareHouseId: null,
      wareHouseName: null,
      orderByProperty: 'palletId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }


  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._palletSettingSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  /************************* TOASTR & PRIME NG Messages  *************************/
  // Prime NG Growl in other ways Toaster
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs.push({
      severity: severity,
      summary: this._translateSvc.instant(summary),
      detail: this._translateSvc.instant(detail)
    });
    setTimeout(() => {
      this.clearMessage();
    }, 1500);
  }

  clearMessage() {
    this.msgs = [];
  }

  showError(error) {
    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += this.msgs + '<strong>' + msg['field'].toString() + '</strong> :' + msg['message'].toString() + '</br>';
      }
      this.showMessage('error', 'error', mess);
    } else if (error['errorCode']) {
      this.showMessage('error', 'error', error['errorCode']);
    } else {
      this.showMessage('error', 'error', error);
    }
  }

  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

}
