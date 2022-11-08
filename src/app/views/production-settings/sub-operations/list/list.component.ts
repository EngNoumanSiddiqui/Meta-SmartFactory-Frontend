import { Subscription, Subject } from 'rxjs';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';

@Component({
  selector: 'sub-operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListSubOperationComponent implements OnInit {
  @ViewChild('mySubOperationModal') public myModal: ModalDirective;
  subOperationModal = {
    modal: null,
    data: null,
    id: null
  };
  operationId = null;
  @Input() operationCode = null;
  @Input() operationName = null;
  @Input() isDetail = false;
  @Input('operationId') set setOperationId(operationId) {
    if (operationId) {
      this.operationId = operationId;
      this.pageFilter.operationId = operationId;
      this.filter(this.pageFilter);
    }
  }

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


  selectedColumns = [
    {field: 'subOperationId', header: 'sub-operation-id'},
    {field: 'subOperationName', header: 'sub-operation-name'},
    {field: 'totalSkillValue', header: 'top-skill-value'}
  ];
  cols = [
    {field: 'subOperationId', header: 'sub-operation-id'},
    {field: 'subOperationName', header: 'sub-operation-name'},
    {field: 'totalSkillValue', header: 'top-skill-value'}
  ];
  private searchTerms = new Subject<any>();

  selectedSubOperations = [];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    operationCode: null,
    operationId: null,
    operationName: null,
    orderByDirection: 'desc',
    orderByProperty: 'subOperationId',
    query: null,
    subOperationId: null,
    subOperationName: null,
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  subOperations = [];
  isSaveAndNew: boolean;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {
    this.subOperationModal.id = id;
    this.subOperationModal.modal = mod;
    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _subOperationSvc: SubOperationService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {
              
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(600),
      switchMap(term => this._subOperationSvc.filterObservable(term))).subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.subOperations = result['content'];
        this.loaderService.hideLoader();
      }, error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });


    this.filter(this.pageFilter);
  }


  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this._subOperationSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    this.subOperationModal.modal = mod;
    this.subOperationModal.data = data[0];
    this.myModal.show();
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      // this.modal.active = true;
      this.subOperationModal.modal = 'NEW';
      myModal.show();
    }
    this.isSaveAndNew = false;
    this.selectedSubOperations.length = 0;
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
      operationCode: null,
      operationId: null,
      operationName: null,
      orderByDirection: 'desc',
      orderByProperty: 'subOperationId',
      query: null,
      subOperationId: null,
      subOperationName: null,
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._subOperationSvc.delete(id)
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
}
