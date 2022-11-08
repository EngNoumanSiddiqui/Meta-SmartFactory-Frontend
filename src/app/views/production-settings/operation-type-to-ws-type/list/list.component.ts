import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {ConfirmationService} from 'primeng';
import {EnumWorkStationStatusService} from '../../../../services/dto-services/enum/workstation-status.service';
import {WorkstationTypeService} from '../../../../services/dto-services/workstation-type/workstation-type.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { OperationTypeToWSTypeService } from 'app/services/dto-services/operation/operation-type-to-ws-type.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

@Component({
  selector: 'optype-to-wstype-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // @ViewChild('myModal', {static: false}) public myModal: ModalDirective;


  connectingOPTOWSModal = {
    modal: '',
    data: null,
    id: null
  };

  isSaveAndNew: boolean;

  selectedoperationTypeToWsTypeList

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
    operationTypeId: null,
    operationTypeName: null,
    operationTypeToWsTypeId: null,
    workStationTypeId: null,
    workStationTypeName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };
  selectedColumns = [
    {field: 'operationTypeToWsTypeId', header: 'operation-type-to-ws-type-id'},
    {field: 'operationTypeId', header: 'operation-type-id'},
    {field: 'operationTypeName', header: 'operation-type-name'},
    {field: 'workStationTypeId', header: 'workstation-type-id'},
    {field: 'workStationTypeName', header: 'workstation-type-name'},
  ];
  cols = [
    {field: 'operationTypeToWsTypeId', header: 'operation-type-to-ws-type-id'},
    {field: 'operationType.operationTypeId', header: 'operation-type-id'},
    {field: 'operationType.operationTypeName', header: 'operation-type-name'},
    {field: 'workStationTypeId', header: 'workstation-type-id'},
    {field: 'workStationTypeName', header: 'workstation-type-name'},
  ];

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];
  operationTypeToWsTypeList = [];

  listStatus;
  listTypes;
  groupTpeID = 11;

  showLoader = false;
  modal = {active: false};

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private optowsTypeService: OperationTypeToWSTypeService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

  }


  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {
    this.connectingOPTOWSModal.id = id;
    this.connectingOPTOWSModal.modal = mod;
    // this.myModal.show();
    this.modal.active = true;
  }
  SaveActionFire(isSaveAndNew: boolean) {
    this.optowsTypeService.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.connectingOPTOWSModal.modal = mod;
    this.connectingOPTOWSModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.connectingOPTOWSModal.modal = 'NEW';
      myModal.show();
    }
    this.connectingOPTOWSModal.id = null;
    this.isSaveAndNew = false;
    this.selectedoperationTypeToWsTypeList.length = 0;
  }
  ngOnInit() {
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this.optowsTypeService.filter(data)
      .then(result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.operationTypeToWsTypeList = result['content'];
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      operationTypeId: null,
      operationTypeName: null,
      operationTypeToWsTypeId: null,
      workStationTypeId: null,
      workStationTypeName: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.optowsTypeService.delete(id)
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

  showOperationTypeDetail(operationTypeId){
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATIONTYPE, operationTypeId);
  }

  showWorkstationTypeDetail(workstationTypeId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATIONTYPE, workstationTypeId);
  }
}
