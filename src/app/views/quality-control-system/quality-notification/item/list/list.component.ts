import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import {ItemService} from 'app/services/dto-services/quality-notification/item/item.service'
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'list-item',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListItem implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;

  ItemModal = {
    modal: null,
    data: null,
    id: null
  };
  anyRecordSelected: boolean = false;
  qualityNotificationId: any;

  @Input('qualityNotificationId') set setqualityNotification(qualityNotificationId) {
    if (qualityNotificationId) {
      this.qualityNotificationId = qualityNotificationId;
      this.filter(this.pageFilter);
    }
  }

  selectedColumns = [
    { field: 'qualityNotificationItemId', header: 'Item Id' },
    { field: 'qualityNotificationItemCode', header: 'Item Code' },
    { field: 'qualityDefectLocation', header: 'Defect Location' },
    { field: 'qualityDefectType', header: 'Defect Type' },
    { field: 'qualityDefectRecording', header: 'Defect Recording' },
    { field: 'description', header: 'Description' },
  ];
  cols = [
    { field: 'qualityNotificationItemId', header: 'Item Id' },
    { field: 'qualityNotificationItemCode', header: 'Item Code' },
    { field: 'qualityDefectLocation', header: 'Defect Location' },
    { field: 'qualityDefectType', header: 'Defect Type' },
    { field: 'qualityDefectRecording', header: 'Defect Recording' },
    { field: 'description', header: 'Description' },
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
    qualityDefectLocationId: null,
    qualityDefectRecordingId: null,
    qualityDefectTypeId: null,
    qualityNotificationId: null,
    qualityNotificationItemCode: null,
    qualityNotificationItemId: null,
    description: null,
    query: null,
    orderByProperty: 'qualityNotificationItemId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc',];

  qualityItemTab = [];
  selectedItem = [];
  modal = { active: false };
  display = false;

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string, data?: any) {
    this.ItemModal.id = id;
    this.ItemModal.modal = mod;
    this.ItemModal.data = data;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.ItemModal.modal = mod;
    this.ItemModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.ItemModal.modal = 'NEW';
      myModal.show();
    }
    this.ItemModal.id = null;
    this.isSaveAndNew = false;
    this.selectedItem = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _itemService: ItemService
  ) {}

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._itemService.filterNotificationItemObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.qualityItemTab = result['content'];
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.qualityItemTab = [];
      }
    );
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
    if(item === 'defectLocation' || item === 'defectType' || item === 'description') {
      this.classReOrder[id] = null
    }
    else if (this.classReOrder[id] === 'asc') {
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
      qualityDefectLocationId: null,
      qualityDefectRecordingId: null,
      qualityDefectTypeId: null,
      qualityNotificationId: null,
      qualityNotificationItemCode: null,
      qualityNotificationItemId: null,
      description: null,
      query: null,
      orderByProperty: 'qualityNotificationItemId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'quality-item',
      accept: () => {
          this._itemService.deleteNotificationItem(id).then(
            result => {
              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
