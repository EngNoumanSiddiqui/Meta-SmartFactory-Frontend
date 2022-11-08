import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ConfirmationService, MenuItem } from 'primeng';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { BookType } from 'xlsx';
@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService]
})
export class ListCustomerComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;

  customerModal = {
    modal: null,
    data: null,
    id: null
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



  selectedColumns = [
    { field: 'actId', header: 'account-id' },
    { field: 'actNo', header: 'account-no' },
    { field: 'actName', header: 'account-name' },
    { field: 'accountPosition', header: 'account-position' },
    // { field: 'actTypeName', header: 'account-type', objectField:'actType' },
    { field: 'actType', header: 'account-type' },

    { field: 'description', header: 'description' },
    // { field: 'actTypeName', header: 'prefix' },
    { field: 'taxId', header: 'tax-id' },
    { field: 'contactName', header: 'contact' },
    { field: 'actStatus', header: 'status' },
    { field: 'priority', header: 'priority' },
    // {field: 'accountPosition', header: 'account-position'}
  ];
  cols = [
    { field: 'actId', header: 'account-id' },
    { field: 'actNo', header: 'account-no' },
    { field: 'prefix', header: 'prefix' },
    { field: 'actName', header: 'account-name' },
    { field: 'description', header: 'description' },
    { field: 'actType', header: 'account-type' },
    // { field: 'actTypeName', header: 'prefix' },
    { field: 'accountPosition', header: 'account-type' },
    { field: 'contactName', header: 'contact' },
    { field: 'actStatus', header: 'status' },
    { field: 'priority', header: 'priority' },
    { field: 'phone', header: 'phone' },
    { field: 'taxId', header: 'tax-id' },
    { field: 'email', header: 'email' },
    { field: 'fax', header: 'fax' },
    { field: 'gsm', header: 'gsm' },
    { field: 'webSite', header: 'webSite' },
    // {field: 'accountPosition', header: 'account-position'}
  ];

  showLoader = false;
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
    actName: null,
    actNo: null,
    actStatus: 'ACTIVE',
    actTypeName: null,
    actTypeId: null,
    plantId: null,
    contactName: null,
    accountPosition: null,
    query: null,
    orderByProperty: 'actId',
    orderByDirection: 'desc',
    priority: null
  };

  classReOrder = ['desc', 'desc', 'desc', 'desc'];

  customers = [];
  listActStatus;
  listActTypes;
  listAccountPosition;
  modal = { active: false };
  display = false;

  commonPriorities = [];
  sub: Subscription[] = [];

  selectedCustomers = [];
  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;
  modalShow(id, mod: string, data) {
    this.customerModal.id = id;
    this.customerModal.modal = mod;
    this.selectedCustomers = [];
    this.selectedCustomers.push({...data});
    this.modal.active = true;
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.customerModal.id= null;
    this.customerModal.modal = mod;
    this.customerModal.data = data[0];
    this.customerModal.id = data[0].actId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.customerModal.modal = 'NEW';
      myModal.show();
    }
    this.customerModal.id = null;
    this.isSaveAndNew = false;
    this.selectedCustomers = null;
  }
  constructor(private _confirmationSvc: ConfirmationService,
    private _enumActStatus: EnumActStatusService,
    private _enumActPosition: EnumActPositionService,
    private _actTypes: ActTypeService,
    private _translateSvc: TranslateService,
    private appStateService: AppStateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _enumSvc: EnumService) {


  }

  ngOnInit() {
    this._enumActStatus.getEnumList().then(result => this.listActStatus = result).catch(error => console.log(error));

    this._enumActPosition.getEnumActPOsitionList().then(res => this.listAccountPosition = res).catch(error => console.log(error));
    this._enumSvc.getCommonPriorityEnum().then((result:any) => this.commonPriorities = result).catch(error => console.log(error));

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._actSvc.filterObservable(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.customers = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.customers = [];
      }
    );
    // this.filter(this.pageFilter);
    this.sub.push( this.appStateService.plantAnnounced$.subscribe(res => {
      if (res) {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
        this._actTypes.getbyPlantId(this.pageFilter.plantId).then(result => this.listActTypes = result).catch(error => console.log(error));
      } else {
        this.pageFilter.plantId = null;
      }

    }));
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.forEach(s => s.unsubscribe());
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

    this.search(this.pageFilter)
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'desc') {
      this.classReOrder[id] = 'asc';
    } else {
      this.classReOrder[id] = 'desc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: this.pageFilter.pageSize,
      actName: null,
      actNo: null,
      actTypeId: null,
      actStatus: 'ACTIVE',
      plantId: this.pageFilter.plantId,
      actTypeName: null,
      accountPosition: null,
      contactName: null,
      query: null,
      orderByProperty: 'actName',
      orderByDirection: 'desc',
      priority: null
    };
    this.filter(this.pageFilter);
  }

  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedCustomers.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'actType') {
            obj[this._translateSvc.instant(col.header)] = itm.actType ? itm.actType?.actTypeName : '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Accounts');
    } else {
      this.loaderService.showLoader();
      this._actSvc.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'actType') {
              obj[this._translateSvc.instant(col.header)] = itm.actType ? itm.actType?.actTypeName : '';
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'Accounts');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }




  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._actSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showWarningToast('cancelled-operation');
      }
    })
  }

}

