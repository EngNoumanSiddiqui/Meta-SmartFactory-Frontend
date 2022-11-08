import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap, count} from 'rxjs/operators'
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { environment } from 'environments/environment';
import { ConfirmationService, MenuItem } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ConvertUtil } from 'app/util/convert-util';
import { BookType } from 'xlsx/types';

@Component({

  templateUrl: './list.component.html'
})
export class ListBatchComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  batchModal = {
    modal: null,
    id: null,
    code: null,

  };

  menuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(false, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(false, 'xlsx');
      }
    }
  ];
  selecteMenuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(true, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(true, 'xlsx');
      }
    }
  ];

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
  modal = {active: false};
  selectedBatchs;
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? environment.filterRowSize : 10,
    batchCode: null,
    batchId: null,
    stockId: null,
    stockName: null,
    plantName: null,
    plantId: null,
    countryName: null,
    actName: null,
    createDate: null,
    availableFrom: null,
    manufactureDate: null,
    lastGoodsReceipt: null,
    vendor: null,
    vendorBatch: null,
    batchLevel: null,
    query: null,
    orderByProperty: 'batchId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc'];
  selectedColumns = [
    {field: 'batchCode', header: 'batch'},
    {field: 'stockNo', header: 'material-no'},
    {field: 'stockName', header: 'material'},
    {field: 'plantName', header: 'plant'},
    // {field: 'vendorName', header: 'customer'},
    // {field: 'vendorName', header: 'supplier'},
    // {field: 'lastGoodsReceipt', header: 'last-goods-receipt'},
    {field: 'batchLevel', header: 'batch-level'},
    {field: 'createDate', header: 'create-date'},
    // {field: 'countryName', header: 'country-of-origin'},

    {field: 'requestedBy', header: 'requested-by'},
    // {field: 'actName', header: 'act-name'},

    // {field: 'manufactureDate', header: 'manufacture-date'},
    // {field: 'availableFrom', header: 'available-from'}
  ];
  cols = [
    {field: 'batchCode', header: 'batch'},
    {field: 'stockNo', header: 'material-no'},
    {field: 'stockName', header: 'material'},
    {field: 'batchLevel', header: 'batch-level'},
    {field: 'requestedBy', header: 'requested-by'},
    {field: 'plantName', header: 'plant'},
    {field: 'vendorName', header: 'customer'},
    {field: 'vendorName', header: 'supplier'},
    // {field: 'lastGoodsReceipt', header: 'last-goods-receipt'},
    {field: 'createDate', header: 'create-date'},
    // {field: 'countryName', header: 'country-of-origin'},
    // {field: 'manufactureDate', header: 'manufacture-date'},
    // {field: 'availableFrom', header: 'available-from'},
    {field: 'note', header: 'description'},
  ];
  batchs = [];
  private searchTerms = new Subject<any>();
  showLoader = false;
  selectedAct = null;
  sub: Subscription;
  noBatch = false;
  listbatchLevel: any;
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _batchSrvc: BatchService,
              private utilities: UtilitiesService,
              private enumService: EnumService,
              private appStateService: AppStateService,
              private loaderService: LoaderService) {
               

  }

  modalShow(id, code, mod: string) {

    this.batchModal.id = id;
    this.batchModal.code = code;
    this.batchModal.modal = mod;

    this.modal.active = true;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._batchSrvc.filterObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();

        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.batchs = result['content'];
        if (!this.batchs || this.batchs && (this.batchs.length < 1)) {
           this.noBatch = true;
        } else {
          this.noBatch = false;
        }
        // this.batchs.forEach(btch => {
        //   btch.manufactureDate = btch.manufactureDate ? new Date(btch.manufactureDate) : btch.manufactureDate;
        //   btch.availableFrom = btch.availableFrom ? new Date(btch.availableFrom) : btch.availableFrom;
        //   btch.createDate = btch.createDate ? new Date(btch.createDate) : btch.createDate;
        //   btch.lastGoodsReceipt = btch.lastGoodsReceipt ? new Date(btch.lastGoodsReceipt) : btch.lastGoodsReceipt;
        // });
      },
      error => {
        this.batchs = [];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      }
    );


    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantName = null;
        // this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
        // this.pageFilter.plantId = res.plantId;
      }
      
    });

    // this.filter(this.pageFilter);
    this.enumService.getBatchLevel().then((res: any) => {
      this.listbatchLevel = res;
    });
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
    const temp = Object.assign({}, data);
    if (temp.manufactureDate) {
      temp.manufactureDate = ConvertUtil.localDateShiftAsUTC(temp.manufactureDate).toISOString();
      temp.manufactureDate = temp.manufactureDate.split('T')[0];
    }
    if (temp.availableFrom) {
      temp.availableFrom = ConvertUtil.localDateShiftAsUTC(temp.availableFrom).toISOString();
      temp.availableFrom = temp.availableFrom.split('T')[0];
    }
    if (temp.createDate) {
      temp.createDate = ConvertUtil.localDateShiftAsUTC(temp.createDate).toISOString();
      temp.createDate = temp.createDate.split('T')[0];
    }
    if (temp.lastGoodsReceipt) {
      temp.lastGoodsReceipt = ConvertUtil.localDateShiftAsUTC(temp.lastGoodsReceipt).toISOString();
      temp.lastGoodsReceipt = temp.lastGoodsReceipt.split('T')[0];
    }

    this.searchTerms.next(temp);
  }


  filterByColumn(value, field) {
    console.log('filterByColum', value, field);
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if (field === 'vendorName') {
      this.pageFilter.vendor = value;
    } else {
      this.pageFilter[field] = value;
    }
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
      pageSize: this.pageFilter.pageSize,
      actName: null,
      batchCode: null,
      batchId: null,
      stockId: null,
      countryName: null,
      stockName: null,
      batchLevel: null,
      plantName: this.pageFilter.plantName,
      plantId: this.pageFilter.plantId,
      createDate: null,
      availableFrom: null,
      manufactureDate: null,
      lastGoodsReceipt: null,
      vendor: null,
      vendorBatch: null,
      query: null,
      orderByProperty: 'batchCode',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._batchSrvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showPlantDetailDialog(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showMaterialDetailDialog(materialId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  showCustomerDetailDialog(customerId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, customerId);
  }
  showCountryDialog(countryId){
    this.loaderService.showDetailDialog(DialogTypeEnum.COUNTRY, countryId);
  }
  showEmployeeDialog(actID) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, actID);
  }


  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedBatchs.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Batches');
    } else {
      this.loaderService.showLoader();
      this._batchSrvc.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'createDate') {
              obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'Batches');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }

}
