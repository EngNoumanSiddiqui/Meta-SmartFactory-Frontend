import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, Message} from 'primeng';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {environment} from '../../../../../environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListCapabilityComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  capabilityModal = {
    modal: null,
    id: null,
    data: null,
  };
  /********* DataTable settings*************/
  selectedCapability;
  showLoader = false;
  selectedColumns = [

    {field: 'skillMatrixCode', header: 'skill-matrix-code'},
    {field: 'grouType', header: 'group-type'},
    {field: 'skillMatrixCategory', header: 'skill-matrix-category'},
    
    {field: 'skillMatrixName', header: 'skill-matrix-name'},
    {field: 'maxProficiency', header: 'max-proficiency'},
    {field: 'minProficiency', header: 'min-proficiency'},
    // {field: 'maxInterest', header: 'max-interest'},
    // {field: 'minInterest', header: 'min-interest'},
    {field: 'skillMatrixDescription', header: 'cap-description'}
  ];
  cols = [
    {field: 'skillMatrixCode', header: 'skill-matrix-code'},
    {field: 'grouType', header: 'group-type'},
    {field: 'skillMatrixCategory', header: 'skill-matrix-category'},
    {field: 'skillMatrixName', header: 'skill-matrix-name'},
    {field: 'maxProficiency', header: 'max-proficiency'},
    {field: 'minProficiency', header: 'min-proficiency'},
    // {field: 'maxIntrest', header: 'max-interest'},
    // {field: 'minIntrest', header: 'min-interest'},
    {field: 'description', header: 'cap-description'}
  ];
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  capabilities = [] = [];
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

  pageFilter =
    {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      capabilityCode: null,
      cabability: null,
      maxProficiency: null,
      plantId: null,
      minProficiency: null,
      maxIntrest: null,
      minIntrest: null,
      description: null,
      orderByDirection: null,
      orderByProperty: null,
      query: null
    };
  sub: Subscription;
  selectedPlant: any;
  private searchTerms = new Subject<any>();

  /********* DataTable settings*************/
  constructor(private _confirmationSvc: ConfirmationService,
              private _router: Router,
              private _translateSvc: TranslateService,
              private _capailitySrv: EmployeeCapabilityService,
              private appStateService:AppStateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (res) {
                   this.selectedPlant = res;
                   this.pageFilter.plantId = this.selectedPlant?.plantId;
                   this.filter(this.pageFilter);
                  } else {
                    this.selectedPlant = null;
                    this.pageFilter.plantId = null;
                  }
                });
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(800),
      switchMap(term => this._capailitySrv.filter(term))).subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.capabilities = result['content'];
        this.loaderService.hideLoader();
      }, (error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    }));
    this.filter(this.pageFilter);
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }


  filter(data) {
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
    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 500);
  }

  reOrderData(id, item: string) {
    if (item === 'capabilityCode') {
      this.pageFilter.orderByProperty = 'et.capabilityCode';
    } else {
      this.pageFilter.orderByProperty = item;
    }
    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, rowData) {
    console.log('@OnEdit', id, mod);
    this.capabilityModal.id = id;
    this.capabilityModal.modal = mod;
    this.capabilityModal.data = rowData;
    this.myModal.show();
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._capailitySrv.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
