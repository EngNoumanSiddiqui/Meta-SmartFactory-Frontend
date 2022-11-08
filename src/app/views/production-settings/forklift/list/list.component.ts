import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { UtilitiesService } from 'app/services/utilities.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'ForkLift-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ForkLiftListComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  partModal = {
    modal: null,
    id: null
  };
  selectedColumns = [
    {field: 'forkliftId', header: 'vehicle-id'},
    {field: 'forkliftNo', header: 'vehicle-no'},
    {field: 'forkliftName', header: 'vehicle-name'},
    {field: 'forkliftDescription', header: 'description'},
    {field: 'forkliftStatus', header: 'vehicle-status'},
    {field: 'vehicleType', header: 'vehicle-type'},
    // {field: 'active', header: 'active'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
    
  ];
  cols = [
    {field: 'forkliftId', header: 'vehicle-id'},
    {field: 'forkliftNo', header: 'vehicle-no'},
    {field: 'forkliftName', header: 'vehicle-name'},
    {field: 'forkliftDescription', header: 'description'},
    {field: 'forkliftStatus', header: 'vehicle-status'},
    {field: 'vehicleType', header: 'vehicle-type'},
    // {field: 'active', header: 'active'},
    {field: 'wareHouse', header: 'warehouse'},
    {field: 'createDate', header: 'create-date'},
    {field: 'updateDate', header: 'update-date'},
  ];

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    forkliftId: null,
    forkliftName: null,
    forkliftNo: null,
    forkliftStatus: null,
    vehicleType: null,
    createDate: null,
    updateDate: null,
    plantId: null,
    query: null,
    wareHouseId: null,
    wareHouseName: null,
    orderByProperty: 'forkliftId',
    orderByDirection: 'desc',
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
  forkLift = [];
  selectedforkLift = [];
  private searchTerms = new Subject<any>();
  sub: Subscription;
  forkliftTypeList = [];
  vehicleTypeList = [];
  constructor(
    private forkLiftService: ForkLiftService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private _translateSvc: TranslateService,
    private _confirmationSvc: ConfirmationService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService
    ) {
     
    }
  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.forkLiftService.filterObservable(term))).subscribe(
      (result: any) => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.forkLift = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.forkLift = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
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

    this.enumService.getForkLiftStatusEnum().then((res: any) => this.forkliftTypeList = res).catch(err => console.error(err))
    this.enumService.getVehicleTypeEnum().then((res: any) => this.vehicleTypeList = res).catch(err => console.error(err))
    // this.filter(this.pageFilter);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  search(data) {
    this.loaderService.showLoader();
    const temp = Object.assign({}, data);
    if (temp.createDate) {
      // converted to iso string
      temp.createDate = ConvertUtil.localDateShiftAsUTC(temp.createDate);
    }
    this.searchTerms.next(temp);
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
      this.search(this.pageFilter);
    }, 2500);
  }

  modalShow(id, mod: string) {
    // console.log('@call', id, mod);
      this.partModal.id = id;
      this.partModal.modal = mod;
      this.myModal.show();
  }
  reOrderData(id, item: string) {

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }
    if (item === 'material') {
      this.pageFilter.orderByProperty = 'materiaName';
    } else if (item === 'jobOrder') {
      this.pageFilter.orderByProperty = 'jobOrderId';
    } else if (item === 'operator') {
      this.pageFilter.orderByProperty = 'operatorName';
    } else if (item === 'plant') {
      this.pageFilter.orderByProperty = 'plantName';
    } else {
      this.pageFilter.orderByProperty = item;
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];

    this.filter(this.pageFilter);
  }
  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.forkLiftService.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
 

  
  showPlantDetailDialog(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  

  showWarehouseDetailDialog(warehouseId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, warehouseId);
  }
}
