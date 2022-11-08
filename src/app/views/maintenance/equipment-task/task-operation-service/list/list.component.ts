/**
 * Created by reis on 29.07.2019.
 */
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {TaskOperationServiceService} from '../../../../../services/dto-services/maintenance-equipment/task-operation-service.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'task-operation-service-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TaskOperationServiceListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null
  };
  private searchTerms = new Subject<any>();
  selectedPlant: any;

  @Input('equipmentTaskOperationId') set e(equipmentTaskOperationId) {
    this.pageFilter.equipmentTaskOperationId = equipmentTaskOperationId;
  }

  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'equipmentTaskOperationExternalServiceId', header: 'task-operation-service-id'},
    {field: 'externalService', header: 'external-service'},
    {field: 'grossPrice', header: 'gross-price'},
    {field: 'currency', header: 'currency'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
  ];
  cols = [
    {field: 'equipmentTaskOperationExternalServiceId', header: 'task-operation-service-id'},
    {field: 'externalService', header: 'external-service'},
    {field: 'equipmentTaskOperation', header: 'task-operation'},
    {field: 'grossPrice', header: 'gross-price'},
    {field: 'currency', header: 'currency'},
    {field: 'quantity', header: 'quantity'},
    {field: 'quantityUnit', header: 'quantity-unit'},
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
    externalServiceId: null,
    equipmentTaskOperationId: null,
    equipmentTaskOperationExternalServiceId: null,
    query: null,
    plantId: null,
    orderByProperty: 'equipmentTaskOperationExternalServiceId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  tableDetailIndex: number;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private _userSvc: UsersService,
              private mStrategyTypeSvc: TaskOperationServiceService) {
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

  getIndex(index) {
    this.tableDetailIndex = index;
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      externalServiceId: null,
      equipmentTaskOperationId: this.pageFilter.equipmentTaskOperationId,
      equipmentTaskOperationExternalServiceId: null,
      query: null,
      plantId: this.pageFilter.plantId,
      orderByProperty: 'equipmentTaskOperationExternalServiceId',
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
