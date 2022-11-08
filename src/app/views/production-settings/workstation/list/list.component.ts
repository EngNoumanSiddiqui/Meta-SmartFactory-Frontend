import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {ConfirmationService} from 'primeng';
import {EnumWorkStationStatusService} from '../../../../services/dto-services/enum/workstation-status.service';
import {WorkstationTypeService} from '../../../../services/dto-services/workstation-type/workstation-type.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkstationComponent implements OnInit, OnDestroy {
  // @ViewChild('myModal', {static: false}) public myModal: ModalDirective;


  workStationModal = {
    modal: '',
    data: null,
    id: null
  };

  isSaveAndNew: boolean;

  selectedWorkstations

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
    plantId: null,
    plantName: null,
    workStationId: null,
    workStationNo: null,
    workStationName: null,
    workStationStatus: null,
    workStationTypeName: null,
    panelActive: null,
    query: null,
    orderByProperty: 'workStationId',
    orderByDirection: 'desc'
  };
  selectedColumns = [
    {field: 'workStationId', header: 'workstation-id'},
    {field: 'workStationNo', header: 'workstation-no'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'description', header: 'description'},
    {field: 'wareHouseName', header: 'warehouse-name'},
    {field: 'outputWarehouse', header: 'output-warehouse'},
    {field: 'workCenterName', header: 'workcenter-name'},
    {field: 'workStationTypeName', header: 'workstation-type'},
    {field: 'parentId', header: 'parent-work-station-Id'},
    {field: 'childId', header: 'child-workstation'},
    {field: 'panelIP', header: 'panel-ip'},
    {field: 'panelActive', header: 'panel-status'},
  ];
  cols = [
    {field: 'workStationId', header: 'workstation-id'},
    {field: 'workStationNo', header: 'workstation-no'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'workCenterName', header: 'workcenter-name'},
    {field: 'workStationState', header: 'workstation-state'},
    {field: 'description', header: 'description'},
    {field: 'wareHouseName', header: 'warehouse-name'},
    {field: 'outputWarehouse', header: 'output-warehouse'},
    {field: 'workStationStatus', header: 'status'},
    {field: 'workStationTypeName', header: 'workstation-type'},
    {field: 'employeeFirstName', header: 'employee-first-name'},
    {field: 'employeeLastName', header: 'employee-last-name'},
    {field: 'parentId', header: 'parent-work-station-Id'},
    {field: 'childId', header: 'child-workstation'},
    {field: 'inputWarehouseLocationNo', header: 'input-location'},
    {field: 'outputWarehouseLocationNo', header: 'output-location'},
    {field: 'panelIP', header: 'panel-ip'},
    {field: 'panelActive', header: 'panel-active'},
    {field: 'model', header: 'model'},
    {field: 'numberOfScissors', header: 'number-of-scissors'},
    {field: 'producer', header: 'producer'},
    {field: 'kwh', header: 'kwh'},
    {field: 'kwhCost', header: 'kwhCost'},
    {field: 'workstationCostRate', header: 'cost-rate'},
    {field: 'mark', header: 'mark'},
    {field: 'capacity', header: 'capacity'}
  ];

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  workstations = [];

  listStatus;
  listTypes;
  groupTpeID = 11;

  showLoader = false;
  modal = {active: false};
  searchTerms = new Subject<any>();
  sub: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumStatus: EnumWorkStationStatusService,
              private _workStationTypes: WorkstationTypeService,
              private _translateSvc: TranslateService,
              private _workstationSvc: WorkstationService,

              private utilities: UtilitiesService,
              private appStateService: AppStateService,
              private loaderService: LoaderService) {
                this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
                  if ((res) && res.plantId) {
                    this.pageFilter.plantName = res.plantName;
                    this.pageFilter.plantId = res.plantId;
                  } else {
                    this.pageFilter.plantId = null;
                    this.pageFilter.plantName = null;
                  }
                  this.filter(this.pageFilter);
                });
console.log('@workStaitonModel')
  }


  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {
    this.workStationModal.id = id;
    this.workStationModal.modal = mod;
    // this.myModal.show();
    this.modal.active = true;
  }
  SaveActionFire(isSaveAndNew: boolean) {
    this._workstationSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.workStationModal.modal = mod;
    this.workStationModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    
    // if (this.workStationModal.modal !=='NEW') {
    //   myModal.hide();
    // }
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.workStationModal.modal = 'NEW';
      myModal.show();
    } else {
      myModal.hide();
      this.modal.active = false;
    }
    
    this.workStationModal.id = null;
    this.isSaveAndNew = false;
    if (this.selectedWorkstations && this.selectedWorkstations.length > 0) {
      this.selectedWorkstations.length = 0;
    }
  }
  ngOnInit() {
    // this.filter(this.pageFilter);
    this._enumStatus.getEnumList().then(result => this.listStatus = result).catch(error => console.log(error));
    // this._workStationTypes.getIdNameList().then(result => this.listTypes = result).catch(error => console.log(error));

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._workstationSvc.filterObservableList(term))).subscribe(
      result => {
        this.loaderService.hideLoader();
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.workstations = result['content'];
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
        this.workstations = [];
      }
    );

    this.filter(this.pageFilter);
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
    // this._workstationSvc.filter(data)
    //   .then(result => {
    //     this.loaderService.hideLoader();
    //     this.pagination.currentPage = result['currentPage'];
    //     this.pagination.totalElements = result['totalElements'];
    //     this.pagination.totalPages = result['totalPages'];
    //     this.workstations = result['content'];
    //      console.log('@IdIssue', this.workstations);
    //     // console.log(result);
    //   })
    //   .catch(error => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showErrorToast(error)
    //   });
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
      pageSize: this.pageFilter.pageSize,
      workStationNo: null,
      plantId: null,
      plantName: null,
      panelActive: null,
      workStationId: null,
      workStationName: null,
      workStationStatus: null,
      workStationTypeName: null,
      query: null,
      orderByProperty: 'workStationId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    console.log(id);
    const me = this;
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.loaderService.showLoader();
        this._workstationSvc.delete(id)
          .then(() => {
            this.loaderService.hideLoader();
            this.utilities.showSuccessToast('deleted-success');
            me.filter(this.pageFilter);
          })
          .catch(error => {
            this.loaderService.hideLoader();
            this.utilities.showErrorToast(error);
          });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }

  showWorkcenterDetail(workcenter) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKCENTER, workcenter);

  }
  showWorkStationDetail(workstation) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstation);

  }
  showLocationDetail(id) { 
    this.loaderService.showDetailDialog(DialogTypeEnum.LOCATION, id);
  }
  showwarehouseDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.WAREHOUSE, id);
  }

}
