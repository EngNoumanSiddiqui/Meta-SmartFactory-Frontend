import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { UsageDecisionService } from 'app/services/dto-services/quality-inspection/usage-decision/usage-decision.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

@Component({
  selector: 'list-usage-decision',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListUsageDecision implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  usageDecisionModal = {
    modal: null,
    data: null,
    id: null
  };
  sub: Subscription;

  selectedColumns = [
    { field: 'udCode', header: 'UD Code' },
    { field: 'usageDecision', header: 'Usage Decision' },
    { field: 'qualityScore', header: 'Quality Score' },
    { field: 'inspectionLotQuantity', header: 'Inspection Lot Quantity' },
    { field: 'sampleSize', header: 'Sample Size' },
    { field: 'unrestrictedUse', header: 'Unrestricted Use' },
    { field: 'scrap', header: 'Scrap' },
    { field: 'sampleUsage', header: 'Sample Usage' },
    { field: 'blockedStock', header: 'Blocked Stock' },
    { field: 'reserves', header: 'Reserve' },

  ];
  cols = [
    { field: 'usageDecisionId', header: 'Usage Decision Id' },
    { field: 'udCode', header: 'UD Code' },
    { field: 'usageDecision', header: 'Usage Decision' },
    { field: 'qualityScore', header: 'Quality Score' },
    { field: 'inspectionLotQuantity', header: 'Inspection Lot Quantity' },
    { field: 'sampleSize', header: 'Sample Size' },
    { field: 'unrestrictedUse', header: 'Unrestricted Use' },
    { field: 'scrap', header: 'Scrap' },
    { field: 'sampleUsage', header: 'Sample Usage' },
    { field: 'blockedStock', header: 'Blocked Stock' },
    { field: 'reserves', header: 'Reserve' },

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
    usageDecisionId: null,
    udCode: null,
    usageDecision: null,
    qualityScore: null,
    inspectionLotQuantity: null,
    sampleSize: null,
    unrestrictedUse: null,
    scrap: null,
    sampleUsage: null,
    blockedStock: null,
    reserves: null,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  usageDecisions = [];
  selectedUsageDecisions = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.usageDecisionModal.id = id;
    this.usageDecisionModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.usageDecisionModal.modal = mod;
    this.usageDecisionModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.usageDecisionModal.modal = 'NEW';
      myModal.show();
    }
    this.usageDecisionModal.id = null;
    this.isSaveAndNew = false;
    this.selectedUsageDecisions = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _usageDecisionService: UsageDecisionService,
    private appStateService: AppStateService
  ) {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
      }
      this.filter(this.pageFilter);
    });
  }

  ngOnInit() {
    this.usageDecisions = [];
    this.loaderService.showLoader();
    this._usageDecisionService.filterUsageDecision(this.pageFilter).then(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.usageDecisions = result['content'];
        this.filter(this.pageFilter);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.usageDecisions = [];
      }
    );
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.searchTerms.next(data);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
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
      usageDecisionId: null,
      udCode: null,
      usageDecision: null,
      qualityScore: null,
      inspectionLotQuantity: null,
      sampleSize: null,
      unrestrictedUse: null,
      scrap: null,
      sampleUsage: null,
      blockedStock: null,
      reserves: null,
      plantId: null,
      plantName: null,
      query: null,
      orderByProperty: 'usageDecisionId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'usage-decision',
      accept: () => {
          this._usageDecisionService.deleteUsageDecision(id).then(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.usageDecisions = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.usageDecisions = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
