import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { InvoiceService } from 'app/services/dto-services/invoice/invoice.service';
import { BookType } from 'xlsx/types';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'invoice-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit , OnDestroy{

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['desc', 'asc', 'asc', 'asc', 'asc'];

  private searchLocationTerms = new Subject<any>();

  showLoader = false;
  locations: any = [];
  selectedInvoices: any = [];

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
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    createDate: null,
    createdById: null,
    invoiceId: null,
    invoiceNo: null,
    invoiceType: null,
    notes: null,
    postingDateFinish: null,
    postingDateStart: null,
    referenceId: null,
    updateDate: null,
    orderByDirection: 'desc',
    orderByProperty: 'invoiceId',
    plantId: null,
    organizationId: null,
    query: null,
  };
  locationModal ? = {
    modal: null,
    data: null,
    id: null
  };
  selectedColumns = [
    {field: 'invoiceId', header: 'invoice-id'},
    {field: 'invoiceNo', header: 'invoice-no'},
    {field: 'invoiceType', header: 'invoice-type'},
    // {field: 'organizationId', header: 'organization'},
    // {field: 'plantId', header: 'plant'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'createdBy', header: 'created-by'},
    // {field: 'createDate', header: 'create-date'},
    {field: 'actualAmount', header: 'actual-amount'},
    {field: 'postingDate', header: 'posting-date'},
    // {field: 'updateDate', header: 'update-date'},
    // {field: 'notes', header: 'notes'}
  ];
  cols = [
    {field: 'invoiceId', header: 'invoice-id'},
    {field: 'invoiceNo', header: 'invoice-no'},
    {field: 'invoiceType', header: 'invoice-type'},
    {field: 'organizationId', header: 'organization'},
    {field: 'plant', header: 'plant'},
    {field: 'referenceId', header: 'reference-id'},
    {field: 'createdBy', header: 'created-by'},
    {field: 'createDate', header: 'create-date'},
    {field: 'actualAmount', header: 'actual-amount'},
    {field: 'postingDate', header: 'posting-date'},
    {field: 'updateDate', header: 'update-date'},
    {field: 'notes', header: 'notes'}
    
  ];
  sub: Subscription[] = [];

  @Input() referenceId = null;
  @Input() invoiceType = null;
  @Input() fromTab = false;
  

  constructor(
    private invoiceService: InvoiceService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
             private _confirmationSvc: ConfirmationService,
             private _translateSvc: TranslateService,
              ) {
               

}

  ngOnInit() {

    this.pageFilter.referenceId = this.referenceId;
    this.pageFilter.invoiceType = this.invoiceType;

    this.searchLocationTerms.pipe(
      debounceTime(600),
      switchMap(term => this.invoiceService.filterObs(term))).subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.locations = result['content'];
        this.loaderService.hideLoader();

      }, error => {
        this.loaderService.hideLoader();

        this.utilities.showErrorToast(error)
      });

    this.sub.push(this.appStateService.plantAnnounced$.subscribe(res=>{
      if(res){
        this.pageFilter.plantId = res.plantId;
        this.filter();
      }
      else{
        this.pageFilter.plantId = null;
        
      }
    }));//uncomment when api is changed
    this.sub.push(this.appStateService.organizationAnnounced$.subscribe(res=>{
      if(res){
        this.pageFilter.organizationId = res.organizationId;
        this.filter();
      }
      else{
        this.pageFilter.organizationId = null;
      }
    }));//uncomment when api is changed
    // this.filter();
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.forEach(s => s.unsubscribe());
    }
  }

  showEmployeeDetail(empId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, empId);
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
      this.pageFilter[field] = value;
      this.filter();
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
    setTimeout(() => {
      this.search();
    }, 500);
  }
  //please uncomment when api change is done
  // getOperationTypeById(plantId){
  //   this.wsTypesrv.getIdNameList().then((res:any)=>{
  //     this.workstationTypes = res;
  //   });
  // }

  filter() {
    this.pageFilter.pageNumber = 1;
    this.search();
  }
  search() {
    this.loaderService.showLoader();
    this.searchLocationTerms.next(this.pageFilter);
  }

  modalShow(id, mod: string, data) {
    this.locationModal.id = id;
    this.locationModal.modal = mod;
    this.locationModal.data = data;
    this.myModal.show();
  }

  reOrderData(id, item: string) {

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
  
    this.pageFilter.orderByProperty = item;
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter();
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.invoiceService.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.search();
          })
          .catch(error => this.utilities.showErrorToast(error));

      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }



  exportCSV(selected: boolean = false, type: BookType = 'csv') {
    if(selected) {
      const mappedDAta = this.selectedInvoices.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'createDate') {
            obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
          } else if(col.field === 'postingDate') {
            obj[this._translateSvc.instant(col.header)] = itm.postingDate ? new Date(itm.postingDate).toLocaleString() : '';
          } else if(col.field === 'createdBy') {
            obj[this._translateSvc.instant(col.header)] = itm.createdBy ? itm.createdBy.firstName + ' ' + itm.createdBy.lastName: '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      });
      this.appStateService.exportAsFile(mappedDAta, type, 'Invoices');
    } else {
      this.loaderService.showLoader();
      this.invoiceService.filter({...this.pageFilter, pageNumber: 1, pageSize: this.pagination.totalElements})
      .then(result => {
        const mappedDAta = result['content'].map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'createDate') {
              obj[this._translateSvc.instant(col.header)] = itm.createDate ? new Date(itm.createDate).toLocaleString() : '';
            } else if(col.field === 'postingDate') {
              obj[this._translateSvc.instant(col.header)] = itm.postingDate ? new Date(itm.postingDate).toLocaleString() : '';
            } else if(col.field === 'createdBy') {
              obj[this._translateSvc.instant(col.header)] = itm.createdBy ? itm.createdBy.firstName + ' ' + itm.createdBy.lastName: '';
            } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field];
            }
          });
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'Invoices');
        this.loaderService.hideLoader();
      }, err => {
        this.utilities.showErrorToast(err);
        this.loaderService.hideLoader();
      })
    }
  }

}
