import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { ActivitiesService } from 'app/services/dto-services/quality-notification/item/activities/activities.service';
@Component({
  selector: 'list-item-activities',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListItemActivities implements OnInit {

  itemActivitiesTypeModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'itemActivityId', header: 'Item Activity Id' },
    { field: 'itemActivityName', header: 'Activity Name' },
    { field: 'shortText', header: 'Short Text' },
  ];
  cols = [
    { field: 'itemActivityId', header: 'Item Activity Id' },
    { field: 'itemActivityName', header: 'Activity Name' },
    { field: 'shortText', header: 'Short Text' },
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
    itemActivityId: null,
    itemActivityName: null,
    shortText: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc'];

  itemActivitiesTypes = [];
  selectedItemActivityTypes = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.itemActivitiesTypeModal.id = id;
    this.itemActivitiesTypeModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.itemActivitiesTypeModal.modal = mod;
    this.itemActivitiesTypeModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.itemActivitiesTypeModal.modal = 'NEW';
      myModal.show();
    }
    this.itemActivitiesTypeModal.id = null;
    this.isSaveAndNew = false;
    this.selectedItemActivityTypes = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _activitiesService: ActivitiesService
  ) {}

  ngOnInit() {
    this.itemActivitiesTypes = [];
    this.loaderService.showLoader();
    this._activitiesService.getAll().subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.itemActivitiesTypes = result['content'];
        this.filter(this.pageFilter);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.itemActivitiesTypes = [];
      }
    );
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
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
      itemActivityId: null,
      itemActivityName: null,
      shortText: null,
      query: null,
      orderByProperty: 'itemActivityId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'item-activities',
      accept: () => {
          this._activitiesService.delete(id).subscribe(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.itemActivitiesTypes = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.itemActivitiesTypes = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

}
 