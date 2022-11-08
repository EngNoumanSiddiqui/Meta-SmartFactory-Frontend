import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { TranslateService } from '@ngx-translate/core';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';

@Component({
  selector: 'contact-person-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  @Input('actId') set onact(actId) {
    if (actId) {
      this.actId = actId;
      this.pageFilter.actId = actId;
    }
  }
  customerModal = {
    modal: null,
    data: null,
    id: null
  };
  actId = null;
  selectedColumns = [
    {field: 'actContactPersonId', header: 'account-person-no'},
    {field: 'name', header: 'name'},
    {field: 'email', header: 'email'},
    {field: 'mobile', header: 'mobile'},
    {field: 'phone', header: 'phone'},
    {field: 'fax', header: 'fax'},

    // {field: 'accountPosition', header: 'account-position'}
  ];

cols = [
  {field: 'actContactPersonId', header: 'account-person-no'},
  {field: 'name', header: 'name'},
  {field: 'email', header: 'email'},
  {field: 'mobile', header: 'mobile'},
  {field: 'phone', header: 'phone'},
  {field: 'fax', header: 'fax'}
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
    actId: null,
    actStatus: null,
    actTypeName: null,
    contactName: null,
    accountPosition: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  customers = [];
  listActStatus;
  listActTypes;
  listAccountPosition;
  modal = {active: false};
  display = false;

  selectedCustomers = [];
  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;
  modalShow(id, mod: string) {

    this.customerModal.id = id;
    this.customerModal.modal = mod;

    this.modal.active = true;
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.customerModal.modal = mod;
    this.customerModal.data = data[0].stockId;
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
              private _actSvc: ActService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {
    this._enumActStatus.getEnumList().then(result => this.listActStatus = result).catch(error => console.log(error));
    this._actTypes.getIdNameList().then(result => this.listActTypes = result).catch(error => console.log(error));
    this._enumActPosition.getEnumActPOsitionList().then(res => this.listAccountPosition = res).catch(error => console.log(error));
    this.filter(this.pageFilter);
  }
  filter(data) {
    this.loaderService.showLoader();
    this._actSvc.accountContactPersonfilter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.customers = result['content'];

        this.loaderService.hideLoader();
      }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error)
    });
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
      actNo: null,
      actId: null,
      actStatus: null,
      actTypeName: null,
      accountPosition: null,
      contactName: null,
      query: null,
      orderByProperty: 'actName',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._actSvc.deleteActContactPerson(id)
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
