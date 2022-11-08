import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionPlanOperationService } from 'app/services/dto-services/inspection-plan/inspection-plan-operation.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'list-inspection-plan-operation',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionPlanOperation implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;

  inspectionPlanOperationModal = {
    modal: null,
    data: null,
    id: null
  };
  inspectionPlanId: any;

  @Input('inspectionPlanId') set setinspectionPlanId (inspectionPlanId) {
    if (inspectionPlanId) {
      this.inspectionPlanId = inspectionPlanId;
      this.pageFilter.qualityInspectionPlanId = inspectionPlanId;
      this.filter(this.pageFilter);
    }
  }

  selectedColumns = [
    { field: 'inspectionPlanOperationId', header: 'Inspection Plan Operation Id', index:1 },
    { field: 'inspectionPlanOperationCode', header: 'Inspection Plan Operation Code', index:2 },
    { field: 'qualityInspectionOperation', header: 'Inspection Operation', index:3 },
    // { field: 'qualityInspectionPlan', header: 'Inspection Plan', index:4 },
    { field: 'workCenter', header: 'Workcenter', index:5 },
    { field: 'qualityControlKey', header: 'Control Key', index:6 },
    { field: 'description', header: 'Description',index:7 }
  ];
  cols = [
    { field: 'inspectionPlanOperationId', header: 'Inspection Plan Operation Id', index:1 },
    { field: 'inspectionPlanOperationCode', header: 'Inspection Plan Operation Code', index:2 },
    { field: 'qualityInspectionOperation', header: 'Inspection Operation', index:3 },
    // { field: 'qualityInspectionPlan', header: 'Inspection Plan', index:4 },
    { field: 'workCenter', header: 'Workcenter', index:5 },
    { field: 'qualityControlKey', header: 'Control Key', index:6 },
    { field: 'description', header: 'Description',index:7 }
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
    createDate: null,
    plantId: null,
    plantName: null,
    description: null,
    inspectionPlanOperationCode: null,
    inspectionPlanOperationId: null,
    qualityControlKeyId: null,
    qualityInspectionOperationId: null,
    qualityInspectionPlanId: null,
    updateDate: null,
    workCenterId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  inspectionPlanOperations = [];
  selectedinspectionPlanOperations = [];
  modal = { active: false };
  display = false;
  sub: Subscription;

  statusList = [
    {id: 1, name: 'Ready'},
    {id: 2, name: 'Active'},
    {id: 3, name: 'Deleted'},
  ];

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.inspectionPlanOperationModal.id = id;
    this.inspectionPlanOperationModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.inspectionPlanOperationModal.modal = mod;
    this.inspectionPlanOperationModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspectionPlanOperationModal.modal = 'NEW';
      myModal.show();
    }
    this.inspectionPlanOperationModal.id = null;
    this.isSaveAndNew = false;
    this.selectedinspectionPlanOperations = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionPlanOperationService: InspectionPlanOperationService,
    private appStateService: AppStateService,
    public plantService: PlantService
  ) {
   
  }

  ngOnInit() {
    // this.inspectionPlanOperations = [];
    // this.loaderService.showLoader();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionPlanOperationService.filterInsPlanOperation(term))).subscribe(
      result => {
        if (result) {
          this.loaderService.hideLoader();
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.inspectionPlanOperations = result['content'];
        }
       },
       error => {
         this.utilities.showErrorToast(error);
         this.loaderService.hideLoader();
         this.inspectionPlanOperations = [];
       });
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
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(this.pageFilter);
  }

  search(data) {
    // this.loaderService.showLoader();
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
      pageSize: Number(environment.filterRowSize)
        ? Number(environment.filterRowSize)
        : 10,
      createDate: null,
      description: null,
      inspectionPlanOperationCode: null,
      inspectionPlanOperationId: null,
      qualityControlKeyId: null,
      qualityInspectionOperationId: null,
      qualityInspectionPlanId: null,
      updateDate: null,
      workCenterId: null,
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
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
      key: 'inspection-plan-operation',
      accept: () => {
          this._inspectionPlanOperationService.deleteInsPlanOperation(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspectionPlanOperations = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspectionPlanOperations = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
