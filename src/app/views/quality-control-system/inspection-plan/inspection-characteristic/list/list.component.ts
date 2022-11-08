import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionCharOpService } from 'app/services/dto-services/inspection-plan/inspection-characteristic.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { switchMap, debounceTime } from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'list-inspection-characteristic',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionCharOp implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  inspectionCharOpModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'inspectionCharacteristicOperationId', header: 'Insp. Char. Operation Id' },
    { field: 'shortText', header: 'Insp. Char. Operation Code' },
    { field: 'qualityInspectionCharacteristic', header: 'Inspection Characteristic' },
    { field: 'qualityInspectionMethod', header: 'Inspection Method' },
    { field: 'qualitySamplingProcedure', header: 'Sampling Procedure' },
    { field: 'lowerSpecificLimit', header: 'Lower Specific' },
    { field: 'upperLimit', header: 'Upper Limit' },
  ];
  cols = [
    { field: 'inspectionCharacteristicOperationId', header: 'Insp. Char. Operation Id' },
    { field: 'shortText', header: 'Insp. Char. Operation Code' },
    { field: 'qualityInspectionCharacteristic', header: 'Inspection Characteristic' },
    { field: 'qualityInspectionPlanOperation', header: 'Inspection Plan Operation'},
    { field: 'qualityInspectionMethod', header: 'Inspection Method' },
    { field: 'qualitySamplingProcedure', header: 'Sampling Procedure' },
    { field: 'lowerSpecificLimit', header: 'Lower Specific' },
    { field: 'upperLimit', header: 'Upper Limit' },
  ];
  
  qualityInspectionPlanOperationId = null;
  sub: any;

  @Input('inspectionPlanOperationId') set setinspectionPlanOperationId(inspectionPlanOperationId) {
    if (inspectionPlanOperationId) {
      this.qualityInspectionPlanOperationId = inspectionPlanOperationId;
      this.pageFilter.qualityInspectionPlanOperationId = inspectionPlanOperationId;
      this.filter(this.pageFilter);
    }
  }

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
    inspectionCharacteristicOperationId: null,
    lowerSpecificLimit: null,
    qualityInspectionCharacteristicId: null,
    qualityInspectionMethodId: null,
    qualityInspectionPlanOperationId: null,
    qualitySamplingProcedureId: null,
    plantId: null,
    plantName: null,
    query: null,
    shortText: null,
    updateDate: null,
    upperLimit: null,
    orderByProperty: 'inspectionCharacteristicOperationId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];

  inspectionCharOps = [];
  selectedInspectionCharOps = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.inspectionCharOpModal.id = id;
    this.inspectionCharOpModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.inspectionCharOpModal.modal = mod;
    this.inspectionCharOpModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspectionCharOpModal.modal = 'NEW';
      myModal.show();
    }
    this.inspectionCharOpModal.id = null;
    this.isSaveAndNew = false;
    this.selectedInspectionCharOps = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionCharOpService: InspectionCharOpService,
    private appStateService: AppStateService
  ) {
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionCharOpService.filterObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.inspectionCharOps = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.inspectionCharOps = [];
      }
    );

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
    // this.filter(this.pageFilter);
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      createDate: null,
      inspectionCharacteristicOperationId: null,
      lowerSpecificLimit: null,
      qualityInspectionCharacteristicId: null,
      qualityInspectionMethodId: null,
      qualityInspectionPlanOperationId: this.pageFilter.qualityInspectionPlanOperationId,
      qualitySamplingProcedureId: null,
      plantId: null,
      plantName: null,
      query: null,
      shortText: null,
      updateDate: null,
      upperLimit: null,
      orderByProperty: 'inspectionCharacteristicOperationId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'inspection-characteristic',
      accept: () => {
          this._inspectionCharOpService.delete(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspectionCharOps = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            }).catch(
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspectionCharOps = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
