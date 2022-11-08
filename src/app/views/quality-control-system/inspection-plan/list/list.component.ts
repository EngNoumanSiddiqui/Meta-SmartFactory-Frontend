import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionPlanService } from 'app/services/dto-services/inspection-plan/inspection-plan.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'inspection-plan-list',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionPlan implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  inspectionPlanModal = {
    modal: null,
    data: null,
    id: null
  };
  @Input() fromselectItem = false;
  @Output() selectedEvent = new EventEmitter();
  selectedColumns = [
    { field: 'inspectionPlanId', header: 'inspection-plan-id'},
    { field: 'inspectionPlanCode', header: 'inspection-plan-code'},
    { field: 'stockNo', header: 'material-no'},
    { field: 'stock', header: 'material-name'},
    { field: 'plant', header: 'plant'},
    { field: 'group', header: 'group'},
    { field: 'groupCounter', header: 'group-counter'},
    { field: 'fromLotSize', header: 'from-lot-size' },
    { field: 'toLotSize', header: 'to-lot-size' },
    { field: 'keyDate', header: 'key-date'},
    { field: 'inspecionPlanStatus', header: 'status' }
  ];
  cols = [
    { field: 'inspectionPlanId', header: 'inspection-plan-id' },
    { field: 'inspectionPlanCode', header: 'inspection-plan-code' },
    { field: 'materialNo', header: 'material-no' },
    { field: 'material', header: 'material-name' },
    { field: 'plant', header: 'plant' },
    { field: 'usage', header: 'usage'  },
    { field: 'group', header: 'group' },
    { field: 'groupCounter', header: 'group-counter' },
    { field: 'plannerGroup', header: 'Planner Group' },
    { field: 'planningWorkCenter', header: 'Planning Work Center' },
    { field: 'fromLotSize', header: 'from-lot-size'  },
    { field: 'toLotSize', header: 'to-lot-size'  },
    { field: 'keyDate', header: 'key-date'  },
    { field: 'inspecionPlanStatus', header: 'status'  }
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
    equipmentPlannerGroupId: null,
    fromIotSize: null,
    groupNumberId: null,
    inspecionPlanStatus: null,
    inspectionPlanCode: null,
    inspectionPlanId: null,
    keyDate: null, 
    planningWorkcenterId: null,
    plantId: null,
    plantName: null,
    query: null,
    stockId: null,
    stockName: null,
    toIotSize: null,
    updateDate: null,
    usageId: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  inspectionPlans = [];
  selectedInspectionPlans = [];
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

  modalShow(id, mod: string, data?: any) {
    this.inspectionPlanModal.id = id;
    this.inspectionPlanModal.modal = mod;
    this.inspectionPlanModal.data = data;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.inspectionPlanModal.modal = mod;
    this.inspectionPlanModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspectionPlanModal.modal = 'NEW';
      myModal.show();
    }
    this.inspectionPlanModal.id = null;
    this.isSaveAndNew = false;
    this.selectedInspectionPlans = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionPlanService: InspectionPlanService,
    private appStateService: AppStateService,
    private enumService: EnumService,
    public plantService: PlantService
  ) {
   
  }

  ngOnInit() {
    
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionPlanService.filterInspectionPlanObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.inspectionPlans = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.inspectionPlans = [];
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

    this.enumService.getQualityInspectionPlanStatusEnum().then((res: any) => this.statusList = res);
  }

  onRowSelect(event) {
    // event.data
    this.selectedEvent.next(event);
    this.utilities.showInfoToast(event.inspectionPlanCode + ' added');

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
      pageSize: Number(environment.filterRowSize)
        ? Number(environment.filterRowSize)
        : 10,
      createDate: null,
      equipmentPlannerGroupId: null,
      fromIotSize: null,
      groupNumberId: null,
      inspecionPlanStatus: null,
      inspectionPlanCode: null,
      inspectionPlanId: null,
      keyDate: null, 
      planningWorkcenterId: null,
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
      query: null,
      stockId: null,
      stockName: null,
      toIotSize: null,
      updateDate: null,
      usageId: null,
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
      key: 'inspection-plan',
      accept: () => {
          this._inspectionPlanService.deleteInspectionPlan(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspectionPlans = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspectionPlans = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
