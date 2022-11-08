import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';

import {PartService} from '../../../../services/dto-services/part/part.service';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';

import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';

import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';

@Component({
  templateUrl: './list.component.html'
})
export class ListPartComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  partModal = {
    modal: null,
    id: null
  };


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
    partCode: null,
    partName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  parts = [];

  selectedColumns = [
    {field: 'partCode', header: 'part-code'},
    {field: 'partName', header: 'part-name'},
    {field: 'supplier', header: 'supplier'},
    {field: 'description', header: 'description'},
    {field: 'quantity', header: 'quantity'},
    {field: 'unit', header: 'unit'}
  ];

  cols = [
    {field: 'partCode', header: 'part-code'},
    {field: 'partName', header: 'part-name'},
    {field: 'supplier', header: 'supplier'},
    {field: 'description', header: 'description'},
    {field: 'lifeTime', header: 'lifeTime'},
    {field: 'amount', header: 'amount'},
    {field: 'quantity', header: 'quantity'},
    {field: 'unit', header: 'unit'}
  ];

  showLoader = false;

filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

modalShow(id, mod: string) {
    this.partModal.id = id;
    this.partModal.modal = mod;
    this.myModal.show();
}

  selectedParts;

  constructor(
             private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _router: Router,
              private _partSvc: PartService, private utilities: UtilitiesService,
              private loaderService: LoaderService
              ) {

  }


  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this._partSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.parts = result['content'];
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
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
    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 2500);
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
      partCode: null,
      partName: null,
      query: null,
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
      accept: () => {
        this._partSvc.delete(id)
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

goDetailPage(id) {
    this._router.navigate(['/settings/parts/detail/' + id]);
  }

goEditPage(id) {
    this._router.navigate(['/settings/parts/edit/' + id]);
  }


}

