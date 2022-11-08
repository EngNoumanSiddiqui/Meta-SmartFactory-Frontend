import { Component, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng'; 
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionSpecificationService } from 'app/services/dto-services/quality-inspection/inspection-specification.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
@Component({
  selector: 'list-inspection-specifications',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionSpecifications implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @Output() selectedEvent = new EventEmitter();
  inspectionSpecModal = {
    modal: null,
    data: null,
    id: null
  };
  anyRecordSelected: boolean = false;
  selectedColumns = [
    { field: 'inspectionSpecificationId', header: 'Inspection Specification Id'},
    { field: 'inspectionPlan', header: 'Inspection Plan'},
    { field: 'stockNo', header: 'stock-no'},
    { field: 'stockName', header: 'stock-name'},
    { field: 'plant', header: 'plant'},
    { field: 'group', header: 'Group'},
    { field: 'groupCounter', header: 'Group Counter'},
    { field: 'fromLotSize', header: 'From Lot Size'},
    { field: 'toLotSize', header: 'To Lot Size'},
    { field: 'keyDate', header: 'Key Date'},
    { field: 'status', header: 'Status'},
  ];
  cols = [
    { field: 'inspectionSpecificationId', header: 'Inspection Specification Id'},
    { field: 'inspectionPlan', header: 'Inspection Plan'},
    { field: 'stockNo', header: 'stock-no'},
    { field: 'stockName', header: 'stock-name'},
    { field: 'plant', header: 'plant'},
    { field: 'group', header: 'Group'},
    { field: 'groupCounter', header: 'Group Counter'},
    { field: 'fromLotSize', header: 'From Lot Size'},
    { field: 'toLotSize', header: 'To Lot Size'},
    { field: 'keyDate', header: 'Key Date'},
    { field: 'status', header: 'Status'},
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
    inspectionSpecificationId: null,
    plantId: null,
    inspectionPlan: null,
    group: null,
    groupCounter: null,
    usage: null,
    sampleSize: null,
    keyDate: null,
    selected: false,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  inspectionSpecifications = [];
  selectedinspectionSpecifications = [];
  modal = { active: false };
  display = false;

  usages = [
    {id: 1, name: 'Usage 1'},
    {id: 2, name: 'Usage 2'},
  ];


  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    this.inspectionSpecModal.id = id;
    this.inspectionSpecModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    this.inspectionSpecModal.modal = mod;
    this.inspectionSpecModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspectionSpecModal.modal = 'NEW';
      myModal.show();
    }
    this.inspectionSpecModal.id = null;
    this.isSaveAndNew = false;
    this.selectedinspectionSpecifications = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _inspectionSpecificationService: InspectionSpecificationService,
  ) {}

  ngOnInit() {
    this.inspectionSpecifications = [];
    this.loaderService.showLoader();
    this._inspectionSpecificationService.getAll().subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.inspectionSpecifications = result['content'];
        this.filter(this.pageFilter);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
        this.inspectionSpecifications = [];
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
      inspectionSpecificationId: null,
      inspectionPlan: null,
      group: null,
      groupCounter: null,
      plantId: this.pageFilter.plantId,
      usage: null,
      sampleSize: null,
      keyDate: null,
      selected: false,
      query: null,
      orderByProperty: 'inspectionSpecificationId',
      orderByDirection: 'asc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'inspection-specification',
      accept: () => {
          this._inspectionSpecificationService.delete(id).subscribe(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspectionSpecifications = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspectionSpecifications = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
  onRecordSelect(event) {
    console.log('checkEvent', event);
    this.selectedEvent.next(event.data);
  }

}
