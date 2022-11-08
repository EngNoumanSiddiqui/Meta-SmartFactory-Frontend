import {Component, EventEmitter, OnInit, Output, ViewChild, Input, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../environments/environment';
import {ConfirmationService} from 'primeng/api';
import {EnumOperationStatusService} from '../../../services/dto-services/enum/operation-status.service';
import {EnumOperationTypeService} from '../../../services/dto-services/enum/operation-type.service';
import {OperationService} from '../../../services/dto-services/operation/operation.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {ConvertUtil} from '../../../util/convert-util';
import { Subscription } from 'rxjs';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ProductDetailItemCommunicatingService } from 'app/views/manufacturing-planning-system/basic-manufacturing/product-detail-item.service';


@Component({
  selector: 'choose-operation-pane',
  templateUrl: './choose-operation-pane.component.html',
})
export class ChooseOperationPaneComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  operationModal = {
    modal: null,
    id: null
  };

  @Input() workstationId;
  sub: Subscription;
  @Input('plantId') set plantIdy(plantId) {
    if (plantId) {
      this.pageFilter.plantId = plantId;
    } else {
      this.pageFilter.plantId = null;
    }

  }

  @Input() removeTopButtons = false;


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
    {field: 'operationNo', header: 'operation-no'},
    {field: 'operationName', header: 'operation-name'},
    {field: 'description', header: 'description'},
    {field: 'operationType', header: 'operation-type'}
  ];
  cols = [
    {field: 'operationNo', header: 'operation-no'},
    {field: 'operationName', header: 'operation-name'},
    {field: 'description', header: 'description'},
    {field: 'operationType', header: 'operation-type'}
  ];

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    operationNo: null,
    operationName: null,
    operationStatus: null,
    operationType: null,
    workstationId: null,
    query: null,
    orderByProperty: 'operationId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  operations = [];
  listStatus;
  listTypes;

  showLoader = false;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.operationModal.id = id;
    this.operationModal.modal = mod;

    this.myModal.show();
  }
  @Output() selectedEvent = new EventEmitter();
  constructor(private _confirmationSvc: ConfirmationService,
              private _enumOperationStatus: EnumOperationStatusService,
              private _enumOperationTypes: EnumOperationTypeService,
              private _translateSvc: TranslateService,
              private appStateSvc: AppStateService,
              private prodDetailCommunicatingService: ProductDetailItemCommunicatingService,
              private _opSvc: OperationService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {
                this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
                  if ((res) && res.plantId) {
                    this.pageFilter.plantId = res.plantId;
                  } else {
                    this.pageFilter.plantId = null;
                  }
                });
  }

  onRowSelect(event) {
    // event.data
    this.selectedEvent.next(event);

    this.utilities.showInfoToast(event.operationName + ' added');

  }
  ngOnInit() {
    if (this.workstationId) {
      this.pageFilter.workstationId = this.workstationId;
    }
    this.filter(this.pageFilter);
    this._enumOperationStatus.getEnumList().then(result => this.listStatus = result).catch(error => console.log(error));
    this._enumOperationTypes.getEnumList().then(result => this.listTypes = result).catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  filter(data) {
    this.loaderService.showLoader();
     this._opSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.operations = result['content'];
        // if (this.prodDetailCommunicatingService.seletedProdDTItem && this.prodDetailCommunicatingService.seletedProdDTItem.operationList) {
        //   for (const arr of this.prodDetailCommunicatingService.seletedProdDTItem.operationList) {
        //     this.operations = arr.operation ? (this.operations.filter(itm => itm.operationId !== arr.operation.operationId)) : this.operations;
        //   }
        // }
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
      pageSize: this.pageFilter.pageSize,
      operationNo: null,
      operationName: null,
      plantId: null,
      operationStatus: null,
      operationType: null,
      workstationId: null,
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
        this._opSvc.delete(id)
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
