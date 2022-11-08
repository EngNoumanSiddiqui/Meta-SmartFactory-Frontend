/**
 * Created by reis on 29.07.2019.
 */
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {TaskOperationService} from '../../../../../services/dto-services/maintenance-equipment/task-operation.service';

import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'task-operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TaskOperationListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };

  private searchTerms = new Subject<any>();

  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'equipmentTaskOperationId', header: 'task-operation-id'},
    {field: 'equipmentOperation', header: 'equipment-operation'},
    {field: 'operationOrder', header: 'operation-order'},
    {field: 'work', header: 'work'},
    {field: 'workUnit', header: 'work-unit'},
    {field: 'duration', header: 'duration'},
    {field: 'durationUnit', header: 'duration-unit'},
  ];
  cols = [
    {field: 'equipmentTaskOperationId', header: 'task-operation-id'},
    {field: 'equipmentOperation', header: 'equipment-operation'},
    {field: 'operationOrder', header: 'operation-order'},
    {field: 'work', header: 'work'},
    {field: 'workUnit', header: 'work-unit'},
    {field: 'duration', header: 'duration'},
    {field: 'durationUnit', header: 'duration-unit'},
  ];

  @Input() isDetails = false;
  modal = {active: false};
  equipmentTaskOperationId = null;
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
    equipmentOperationId: null,
    equipmentTaskId: null,
    plantId: null,
    equipmentTaskOperationId: null,
    query: null,
    orderByProperty: 'equipmentTaskOperationId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  selectedPlant: any;

  @Input('equipmentTaskId') set e(equipmentTaskId) {
    this.pageFilter.equipmentTaskId = equipmentTaskId;
  }
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private mStrategyTypeSvc: TaskOperationService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.pageFilter.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.mStrategyTypeSvc.filterObservable(this.pageFilter))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.tableData = [];
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );
    this.filter(this.pageFilter);
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
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;
    if (mod === 'EXTERNAL-SERVICE') {
      this.equipmentTaskOperationId = this.selectedData[0].equipmentTaskOperationId;
    }
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      equipmentOperationId: null,
      equipmentTaskId: this.pageFilter.equipmentTaskId,
      equipmentTaskOperationId: null,
      plantId: this.selectedPlant.plantId,
      query: null,
      orderByProperty: 'equipmentTaskOperationId',
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
        this.mStrategyTypeSvc.delete(id)
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
