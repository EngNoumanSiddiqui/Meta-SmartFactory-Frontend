import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {WorkcenterService} from '../../../../services/dto-services/workcenter/workcenter.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MenuItem} from 'primeng';
import {EnumWorkcenterStatusService} from '../../../../services/dto-services/enum/workcenter-status.service';
import {WorkcenterTypeService} from '../../../../services/dto-services/workcenter-type/workcenter-type.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BookType } from 'xlsx/types';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkcenterComponent implements OnInit , OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;

  workcenterModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedWorkCenters;

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

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    workCenterNo: null,
    workCenterName: null,
    plantId: null,
    plantName: null,
    workCenterTypeName: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    description: null,
  };
  selectedColumns = [
    {field: 'workCenterId', header: 'workcenter-id'},
    {field: 'workCenterNo', header: 'workcenter-no'},
    {field: 'workCenterName', header: 'workcenter-name'},
    {field: 'workCenterTypeName', header: 'type'},
    {field: 'plant', header: 'plant'},
    {field: 'description', header: 'description'},
  ];
  cols = [
    {field: 'workCenterId', header: 'workcenter-id'},
    {field: 'workCenterNo', header: 'workcenter-no'},
    {field: 'workCenterName', header: 'workcenter-name'},
    {field: 'workCenterTypeName', header: 'type'},
    {field: 'plant', header: 'plant'},
    {field: 'description', header: 'description'},
  ];

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc'];

  workcenters = [];

  menuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(false, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(false, 'xlsx');
      }
    }
  ];
  selecteMenuItems:MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o', 
      command: () => {
        this.exportCSV(true, 'csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel', 
      command: () => {
        this.exportCSV(true, 'xlsx');
      }
    }
  ];

  listStatus;
  listTypes;
  showLoader = false;
  groupTpeID = 2;
  isSaveAndNew: boolean;
  sub: Subscription;
  searchTerms = new Subject<any>();
  constructor(private _confirmationSvc: ConfirmationService,
              private _enumWorkcenterStatus: EnumWorkcenterStatusService,
              private _types: WorkcenterTypeService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService,
              private _workcenterSvc: WorkcenterService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.pageFilter.plantId = null;
                    this.pageFilter.plantName = null;
                  } else {
                    this.pageFilter.plantId = res.plantId;
                    this.pageFilter.plantName = res.plantName;
                  }
                  this.filter(this.pageFilter);
                  this.populateTypeList();
                });

  }

  filterByColumn(value, field) {
    console.log('===>', field);
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    if (field === 'plant') {
      // this.pageFilter['plantName'] = value;
      this.pageFilter.plantName = value;
      this.filter(this.pageFilter);

    } else {
      this.pageFilter[field]=value;
      this.filter(this.pageFilter);
    }

  }

  modalShow(id, mod: string, data?) {
    this.workcenterModal.id = id;
    this.workcenterModal.modal = mod;
    this.workcenterModal.data = data ? data : null;
    this.myModal.show();
  }

  ngOnInit() {

    this._enumWorkcenterStatus.getEnumList().then(result => this.listStatus = result).catch(error => console.log(error));
    // this.populateTypeList();
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._workcenterSvc.filterObservable(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.workcenters = result['content'];
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
        this.workcenters = [];
      }
    );

    this.filter(this.pageFilter);
  }
  populateTypeList() {
    this._types.getIdNameList().then((result: any) => {
      if (result && this.pageFilter.plantId) {
        result = result.filter(itm => this.pageFilter.plantId === itm.plantId);
      }
      this.listTypes = result;
    }).catch(error => console.log(error));
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  search() {
    this.pageFilter.pageNumber = 1;
    this.filter(this.pageFilter);
  }

  filter(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
    // this._workcenterSvc.filter(data)
    //   .then(result => {
    //     this.loaderService.hideLoader();
    //     this.pagination.currentPage = result['currentPage'];
    //     this.pagination.totalElements = result['totalElements'];
    //     this.pagination.totalPages = result['totalPages'];
    //     this.workcenters = result['content'];
    //   })
    //   .catch(error => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showErrorToast(error);
    //   });
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this._workcenterSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.workcenterModal.modal = mod;
    this.workcenterModal.data = data[0].stockId;
    this.myModal.show();
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      // this.myModal.show();
      this.workcenterModal.modal = 'NEW';
      myModal.show();
    }
    this.workcenterModal.id = null;
    this.isSaveAndNew = false;
    if (this.selectedWorkCenters && this.selectedWorkCenters.length > 0) {
      this.selectedWorkCenters.length = 0;
    }
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
      this.filter(this.pageFilter)
    }, 500);
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
      workCenterNo: null,
      plantId: null,
      plantName: null,
      workCenterName: null,
      workCenterTypeName: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      description: null,
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._workcenterSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => {
            if (error === 'THERE_ARE_RELATED_DATA_YOU_CAN_NOT_DELETE') {
              this.utilities.showWarningToast(error, 'Relation With WorkStation');
            } else {
              this.utilities.showErrorToast(error);
            }

          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showPlantDetail(plantId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }

  showWorkCenterTypeDetail(workCenterType: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTERTYPE, workCenterType);
  }

  exportCSV(selected=false, type: BookType) {
    if(selected) {
        const mappedDAta = this.selectedWorkCenters.map(itm => {
          const obj = {};
          this.selectedColumns.forEach(col => {
            if(col.field === 'plant') {
              obj[this._translateSvc.instant(col.header)] =itm.plant?.plantName;
            } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
            }
          })
          return (obj);
        });
        this.appStateService.exportAsFile(mappedDAta, type, 'workcenters');
    } else {
      this.loaderService.showLoader();
      this._workcenterSvc.filterObservable({...this.pageFilter, pageNumber: 1,
        pageSize: this.pagination.totalElements}).subscribe(result => {
          this.loaderService.hideLoader();
          const mappedDAta = result['content'].map(itm => {
            const obj = {};
            this.selectedColumns.forEach(col => {
              if(col.field === 'plant') {
                obj[this._translateSvc.instant(col.header)]  =itm.plant?.plantName;
              } else if(itm.hasOwnProperty(col.field)) {
                obj[this._translateSvc.instant(col.header)] = itm[col.field] ? itm[col.field] : '';
              }
              
            })
            return (obj);
          });
          this.appStateService.exportAsFile(mappedDAta, type, 'workcenters');
        }, err => {
          this.utilities.showErrorToast(err);
          this.loaderService.hideLoader();
        });
    }
  }

}

