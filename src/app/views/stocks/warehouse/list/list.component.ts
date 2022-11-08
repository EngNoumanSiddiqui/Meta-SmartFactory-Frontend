import { AppStateService } from 'app/services/dto-services/app-state.service';
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, Message, MenuItem} from 'primeng';
import {WarehouseService} from '../../../../services/dto-services/warehouse/warehouse.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { BookType } from 'xlsx/types';


import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWareHouseComponent implements OnInit , OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  warehModal = {
    modal: null,
    id: null
  };

  selectedWarehouses;
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
    wareHouseName: null,
    wareHouseId: null,
    stockName: null,
    plantName: null,
    plantId: null,
    query: null,
    orderByProperty: 'wareHouseId',
    orderByDirection: 'desc'
  };
  showLoader = false;
  classReOrder = ['desc', 'asc'];

  wareHouses = [];

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


  stockQuery = '';
  selectedColumns = [
    {field: 'wareHouseId', header: 'warehouse-id'},
    {field: 'wareHouseNo', header: 'warehouse-no'},
    {field: 'wareHouseName', header: 'warehouse-name'},
    {field: 'parentWareHouseName', header: 'parent-warehouse'},
    {field: 'defaultSelected', header: 'default-selected'},
    {field: 'type', header: 'type'}
  ];
  cols = [
    {field: 'wareHouseId', header: 'warehouse-id'},
    {field: 'wareHouseNo', header: 'warehouse-no'},
    {field: 'wareHouseName', header: 'warehouse-name'},
    {field: 'parentWareHouseName', header: 'parent-warehouse'},
    {field: 'description', header: 'description'},
    {field: 'wareHouseStockDtoList', header: 'quantity'},
    {field: 'wareHouseStockDtoList', header: 'quantity'},
    {field: 'defaultSelected', header: 'default-selected'},
    {field: 'plantName', header: 'plant-name'},
    {field: 'type', header: 'type'},
    {field: 'plantId', header: 'plant-id'},
    {field: 'description', header: 'description'}
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

    this.warehModal.id = id;
    this.warehModal.modal = mod;

    this.myModal.show();
  }
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _wareHouseSvc: WarehouseService,
              private utilities: UtilitiesService,
              private appStateSvc: AppStateService,
              private loaderService: LoaderService) {
               

  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._wareHouseSvc.filterObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.wareHouses = result['content'];
        this.stockQuery =  this.pageFilter.stockName;
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.wareHouses = [];
        this.utilities.showErrorToast(error)
      }
    );
    

    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.pageFilter.plantName = res.plantName;
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
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
      pageSize: this.pageFilter.pageSize,
      wareHouseName: null,
      wareHouseId: null,
      stockName: null,
      query: null,
      plantId:  this.pageFilter.plantId,
      plantName:  this.pageFilter.plantName,
      orderByProperty: 'wareHouseId',
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
        this._wareHouseSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.search(this.pageFilter);
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

  exportCSV(selected=false, type: BookType) {
    if(selected) {
        const mappedDAta = this.wareHouses.map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
             if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
            }
          })
          return (obj);
        });
        this.appStateSvc.exportAsFile(mappedDAta, type, 'warehouses');
    } else {
      this.loaderService.showLoader();
      this._wareHouseSvc.filterObservable({...this.pageFilter, pageNumber: 1,
        pageSize: this.pagination.totalElements}).subscribe(result => {
          this.loaderService.hideLoader();
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
               if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
              }
              
            })
            return (obj);
          });
          this.appStateSvc.exportAsFile(mappedDAta, type, 'warehouses');
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        });
    }
  }

}
