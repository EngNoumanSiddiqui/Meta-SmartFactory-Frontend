import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {RoleService} from '../../../../services/dto-services/permissions/role.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListRoleComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  roleModal = {
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
    roleName: null,
    query: null,
    defaultRoleName: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  selectedColumns = [
    {field: 'defaultRoleName', header: 'default-role-name'},
    {field: 'rolePermissions', header: 'role-permissions'},
  ];
  cols = [
    {field: 'defaultRoleName', header: 'default-role-name'},
    {field: 'active', header: 'active'},
    {field: 'rolePermissions', header: 'role-permissions'},
  ];

  classReOrder = ['asc', 'asc'];
  selectedRoles;
  roles = [];
  showLoader = false;
  private searchTerms = new Subject<any>();

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _roleSvc: RoleService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._roleSvc.filter(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.roles = result['content'];
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.roleModal.id = id;
    this.roleModal.modal = mod;

    this.myModal.show();
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search();
  }
  
  search() {
    this.loaderService.showLoader();
    this.searchTerms.next(this.pageFilter);
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
      this.search()
    }, 2500);
  }


  reOrderData(id, item: string) {
    if(item!=="defaultRoleName"){
      return;
    }
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
      roleName: null,
      query: null,
      defaultRoleName: null,
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
        this._roleSvc.delete(id)
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
