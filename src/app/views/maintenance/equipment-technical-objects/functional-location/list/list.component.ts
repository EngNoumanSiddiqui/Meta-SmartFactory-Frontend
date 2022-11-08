import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {environment} from '../../../../../../environments/environment';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {ConvertUtil} from '../../../../../util/convert-util';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'functional-location-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListFunctionalLocationComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };


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
    mainPlantId	: null,
    mainPlantName : null,
    createDate: null,
    description: null,
    equipmentABCIndicatorId: null,
    equipmentObjectTypeId: null,
    equipmentPlannerGroupId: null,
    generalDate: null,
    invertoryNo: null,
    maintenanceFunctionalLocationId: null,
    manufacturerCountryId: null,
    manufacturerId: null,
    manufpartNo: null,
    manufserialNo: null,
    modelNumber: null,
    parentId: null,
    planningPlantId: null,
    workStationId: null,
    workStationName: null,
    query: null,
    orderByProperty: 'maintenanceFunctionalLocationId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    {field: 'maintenanceFunctionalLocationId', header: 'functional-location-id'},
    {field: 'description', header: 'description'},
    {field: 'equipmentABCIndicator', header: 'abc-indicator'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'workStation', header: 'workstation'},
    {field: 'mainPlant', header: 'maintenance-workstation-plant'},
    {field: 'parentName', header: 'parent-functional-location'}

  ];
  cols = [
    {field: 'maintenanceFunctionalLocationId', header: 'functional-location-id'},
    {field: 'description', header: 'description'},
    {field: 'equipmentABCIndicator', header: 'abc-indicator'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'workStation', header: 'maintenance-workstation'},
    {field: 'mainPlant', header: 'maintenance-workstation-plant'},
    {field: 'parentName', header: 'parent-functional-location'},
    {field: 'equipmentObjectType', header: 'object-type'},
    {field: 'weight', header: 'weight'},
    {field: 'weightUnit', header: 'weight-unit'},
    {field: 'manufacturer', header: 'manufacturer'},
    {field: 'modelNumber', header: 'model'},
    {field: 'manufpartNo', header: 'manufacturer-part-no'},
    {field: 'manufserialNo', header: 'manufacturer-serial-no'},
    {field: 'invertoryNo', header: 'inventory-no'},
    {field: 'generalDate', header: 'general-date'},
    {field: 'manufacturerCountry', header: 'manufacturer-country'},
  ];


  selectedEquipments = [];
  equipments = [];
  listStatus;

  showLoader = false;
  private searchTerms = new Subject<any>();
  sub: any;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private appStateService: AppStateService,
              private _equipmentSvc: FunctionalLocationService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {

               this.sub= this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.resetFilter();
                    this.filter(this.pageFilter);
                  } else {
                    this.pageFilter.planningPlantId = res.plantId;
                    this.filter(this.pageFilter);
                  }
                });

  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._equipmentSvc.filterObservable(term))).subscribe(
      (result: any) => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.equipments = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      }
    );
    this.filter(this.pageFilter);
  }
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter(data) {
    this.loaderService.showLoader();
    this.pageFilter.pageNumber = 1;
    this.searchTerms.next(this.pageFilter);
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
      mainPlantId	: null,
      mainPlantName : null,
      createDate: null,
      description: null,
      equipmentABCIndicatorId: null,
      equipmentObjectTypeId: null,
      equipmentPlannerGroupId: null,
      generalDate: null,
      invertoryNo: null,
      maintenanceFunctionalLocationId: null,
      manufacturerCountryId: null,
      manufacturerId: null,
      manufpartNo: null,
      manufserialNo: null,
      modelNumber: null,
      parentId: null,
      planningPlantId: null,
      workStationId: null,
      workStationName: null,
      query: null,
      orderByProperty: 'maintenanceFunctionalLocationId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }


  delete(id) {
    console.log(id);
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._equipmentSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showEquipmentCategoryDetail(equipmentCategory){
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENTCATEGORY, equipmentCategory)
  }
  showPlantDetail(plantId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId)
  }
  showEquipmentPlannerGroupDetail(plannerGroupId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANNERGROUP, plannerGroupId)
  }
  showWorkstationDetail(workstationId){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId)
  }
  showABCIndicatorDetail(abcIndicator){
    this.loaderService.showDetailDialog(DialogTypeEnum.ABCINDICATOR, abcIndicator)
  }


}
