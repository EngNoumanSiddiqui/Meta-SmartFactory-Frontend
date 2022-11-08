/**
 * Created by reis on 29.07.2019.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../../../environments/environment';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {ConvertUtil} from '../../../../../util/convert-util';
import {EquipmentCodeGroupItemService} from '../../../../../services/dto-services/maintenance-equipment/code-group-item.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'code-group-item-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CodeGroupItemListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null
  };



  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'equipmentCodeGroupItemId', header: 'profile-id'},
    {field: 'parameter', header: 'profile-name'},
    {field: 'shortText', header: 'short-text'}
  ];
  cols = [
    {field: 'equipmentCodeGroupItemId', header: 'profile-id'},
    {field: 'parameter', header: 'profile-name'},
    {field: 'shortText', header: 'short-text'}
  ];

  modal = {active: false};
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
    equipmentCodeGroupItemId: null,
    parameter: null,
    shortText: null,
    plantId: null,
    query: null,
    orderByProperty: 'equipmentCodeGroupItemId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;
  sub: any;
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private appStateSvc: AppStateService,
              private equipmentService: EquipmentCodeGroupItemService) {
  }
  ngOnInit() {
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
      
    });
    // this.filter(this.pageFilter);
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter(data) {
    this.loaderService.showLoader();
    this.equipmentService.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      });
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;

    this.modal.active = true;
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
    this.filter(this.pageFilter)
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

  getIndex(index) {
    this.tableDetailIndex = index;
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      equipmentCodeGroupItemId: null,
      parameter: null,
      shortText: null,
      query: null,
      plantId: this.pageFilter.plantId,
      orderByProperty: 'equipmentCodeGroupItemId',
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
        this.equipmentService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
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
