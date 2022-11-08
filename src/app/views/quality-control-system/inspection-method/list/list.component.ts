import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { switchMap, debounceTime } from 'rxjs/operators';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionMethod implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;

  inspectionMethodModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'inspectionMethodId', header: 'inspection-method-id', index:1 },
    { field: 'inspectionMethodCode', header: 'inspection-method-code', index:2 },
    { field: 'inspectionMethodName', header: 'inspection-method', index:3 },
    { field: 'plant', header: 'plant', index:4 },
    { field: 'validFrom', header: 'valid-from', index:5 },
    { field: 'description', header: 'description', index:6 },
    { field: 'inspectionMethodStatus', header: 'status', index:7 }
  ];
  cols = [
    { field: 'inspectionMethodId', header: 'inspection-method-id', index:1 },
    { field: 'inspectionMethodCode', header: 'inspection-method-code', index:2 },
    { field: 'inspectionMethodName', header: 'inspection-method', index:3 },
    { field: 'plant', header: 'plant', index:4 },
    { field: 'validFrom', header: 'valid-from', index:5 },
    { field: 'description', header: 'description', index:6 },
    { field: 'inspectionMethodStatus', header: 'status', index:7 }
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
    inspectionMethodId: null,
    inspectionMethodCode: null,
    inspectionMethodName: null,
    validFrom: null,
    description: null,
    inspectionMethodStatus: null,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: 'inspectionMethodId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  inspectionMethods = [];
  selectedInspectionMethods = [];
  modal = { active: false };
  display = false;
  sub: Subscription;

  statusList = [];

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.inspectionMethodModal.id = id;
    this.inspectionMethodModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.inspectionMethodModal.modal = mod;
    this.inspectionMethodModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspectionMethodModal.modal = 'NEW';
      myModal.show();
    }
    this.inspectionMethodModal.id = null;
    this.isSaveAndNew = false;
    this.selectedInspectionMethods = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionMethodService: InspectionMethodService,
    public plantService: PlantService,
    private enumService: EnumService,
    private appStateService: AppStateService,
  ) { 
    
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionMethodService.filterInspectionMethodObservable(this.pageFilter))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.inspectionMethods = result['content'];
       },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.inspectionMethods = [];
      }
    );

    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      }
      
    });

    this.enumService.getQualityInspectionMethodStatusEnum().then((res: any ) => this.statusList = res);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
      pageSize: this.pageFilter.pageSize,
      inspectionMethodId: null,
      inspectionMethodCode: null,
      inspectionMethodName: null,
      validFrom: null,
      description: null,
      inspectionMethodStatus: null,
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
      query: null,
      orderByProperty: 'inspectionMethodId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'inspection-method',
      accept: () => {
          this._inspectionMethodService.delete(id).subscribe(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspectionMethods = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspectionMethods = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
