import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionLot implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  inspectionLotModal = {
    modal: null,
    data: null,
    id: null
  };
  lotCreatedOn;
  lotCreatedTo;
  listSettings;
  anyRecordSelected: boolean = false;
  sub: Subscription;

  selectedColumns = [
    { field: 'inspectionLotId', header: 'inspection-lot-id', index:1 },
    { field: 'inspectionLotCode', header: 'inspection-lot-code', index:2 },
    { field: 'plant', header: 'plant', index:3 },
    { field: 'inspectionType', header: 'inspection-type', index:4 },
    // { field: 'createDate', header: 'Create Date', index:10 },
    { field: 'lotCreatedOn', header: 'start-date', index:5 },
    { field: 'lotCreatedTo', header: 'end-date', index:6 },
    { field: 'inspectionLotStatus', header: 'status', index:7 },
  ];
  cols = [
    { field: 'inspectionLotId', header: 'inspection-lot-id', index:1 },
    { field: 'inspectionLotCode', header: 'inspection-lot-code', index:2 },
    { field: 'plant', header: 'plant', index:3 },
    { field: 'inspectionType', header: 'inspection-type', index:4 },
    // { field: 'createDate', header: 'Create Date', index:10 },
    { field: 'lotCreatedOn', header: 'start-date', index:5 },
    { field: 'lotCreatedTo', header: 'end-date', index:6 },
    { field: 'inspectionLotStatus', header: 'status', index:7 },
  ];
  
  showLoader = false;
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    batch: null,
    createDate: null,
    inspectionLotId: null,
    inspectionLotCode: null,
    inspectionLotStatus: null,
    lotCreatedOn: null,
    lotCreatedTo: null,
    orderId: null,
    plantId: null,
    jobOrderId: null,
    prodOrderId: null,
    qualityInfoRecordId: null,
    qualityInspectionOperationId: null,
    qualityInspectionTypeId: null,
    stockId: null,
    updateDate: null,
    vendorId: null,
    query: null,
    orderByProperty: 'inspectionLotId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];

  inspectionLots = [];
  selectedInspectionLots = [];
  modal = { active: false };
  display = false;

  statusList = []
  inspectionTypes = [];
  listSettingsList = [
    {id: 1, name: 'All inspection lots'},
    {id: 2, name: 'Inspection lots without usage decision'},
    {id: 3, name: 'Inspection lots with usage decision'},
  ];

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.inspectionLotModal.id = id;
    this.inspectionLotModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.inspectionLotModal.modal = mod;
    this.inspectionLotModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspectionLotModal.modal = 'NEW';
      myModal.show();
    }
    this.inspectionLotModal.id = null;
    this.isSaveAndNew = false;
    this.selectedInspectionLots = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionLotService: InspectionLotService,
    public plantService: PlantService,
    private appStateService: AppStateService,
    private _enumSvc: EnumService
  ) {
   
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionLotService.filterInspectionLot(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.inspectionLots = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.inspectionLots = [];
      }
    );

    
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
      
    });

    this._enumSvc.getQualityInspectionLotStatusEnum().then((res: any) => { this.statusList = res; });
    this._enumSvc.getQualityInspectionTypeEnum().then((res: any) => { this.inspectionTypes = res; });
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
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  // FILTERING AREA
  filtingAreaColumns (event) {
    this.selectedColumns.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
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

    this.search(this.pageFilter);
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
      pageSize: this.pageFilter.pageSize,batch: null,
      createDate: null,
      inspectionLotId: null,
      inspectionLotCode: null,
      inspectionLotStatus: null,
      lotCreatedOn: null,
      lotCreatedTo: null,
      orderId: null,
      plantId: null,
      jobOrderId: null,
      prodOrderId: null,
      qualityInfoRecordId: null,
      qualityInspectionOperationId: null,
      qualityInspectionTypeId: null,
      stockId: null,
      updateDate: null,
      vendorId: null,
      query: null,
      orderByProperty: 'inspectionLotId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'inspection-lot',
      accept: () => {
          this._inspectionLotService.delete(id).subscribe(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspectionLots = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspectionLots = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  // on select any row, record buttons should be active.
  onRecordSelectAll(event) {
    event.checked? this.inspectionLots.map(item => item.selected = true):
        this.inspectionLots.map(item => item.selected = false);
    this.enableButtons();
  }

  onRecordSelect(event) {
    this.inspectionLots.map(item=>{
      if(item.inspectionLotId === event.data.inspectionLotId) { item.selected = true;}
    });
    this.enableButtons();
  }

  onRecordDeselect(event) {

    this.inspectionLots.map(item=>{
      if(item.inspectionLotId === event.data.inspectionLotId) { item.selected = false;}
    });
    this.enableButtons();
  }

  selectedInspectionLot;
  enableButtons() {
    let counter = 0;
    this.inspectionLots.map(item=>{
      if(item.selected === true) counter ++;
    });
    if( counter === 1 ){ this.anyRecordSelected = true;}
    else {this.anyRecordSelected = false;}

    let selectedInspectionLot = this.inspectionLots.filter(item => item.selected === true);
    this.selectedInspectionLot = selectedInspectionLot[0];
  }
}
