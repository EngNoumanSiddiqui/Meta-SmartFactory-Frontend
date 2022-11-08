import { AppStateService } from './../../../../../services/dto-services/app-state.service';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EquipmentService} from 'app/services/dto-services/equipment/equipment.service';
import {ConfirmationService} from 'primeng';
import {environment} from '../../../../../../environments/environment';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConvertUtil} from '../../../../../util/convert-util';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListEquipmentComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null,
    data: null
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
    equipmentNo: null,
    equipmentName: null,
    equipmentStatus: null,
    query: null,
    planningPlatId: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  selectedColumns = [
    {field: 'equipmentId', header: 'equipment-id'},
    {field: 'equipmentNo', header: 'equipment-no'},
    // {field: 'equipmentName', header: 'equipment-name'},
    {field: 'description', header: 'description'},
    {field: 'dataMinSquareError', header: 'datamin-square-error'},
    {field: 'totalErrorCount', header: 'total-error-count'},
    {field: 'validFrom', header: 'valid-from'},
    {field: 'equipmentCategory', header: 'category'},
    // {field: 'equipmentABCIndicator', header: 'abc-indicator'},
    // {field: 'planningPlant', header: 'planning-plant'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'maintenanceWorkstation', header: 'maintenance-workstation'},
    // {field: 'maintenanceWorkstationPlant', header: 'maintenance-workstation-plant'},
    // {field: 'equipmentObjectType', header: 'object-type'},
    // {field: 'weight', header: 'weight'},
    // {field: 'weightUnit', header: 'weight-unit'},
    // {field: 'manufacturer', header: 'manufacturer'},
    // {field: 'modelNumber', header: 'model'},
    // {field: 'manufacturerPartNo', header: 'manufacturer-part-no'},
    // {field: 'manufacturerSerialNo', header: 'manufacturer-serial-no'},
    // {field: 'manufacturerMonth', header: 'manufacturer-month'},
    // {field: 'manufacturerYear', header: 'manufacturer-year'},
    // {field: 'manufacturerCountry', header: 'manufacturer-country'},
    {field: 'maintenanceFuntionalLocation', header: 'functional-location'},
  ];
  cols = [
    {field: 'parentEquipment', header: 'parent-equipment'},
    {field: 'equipmentId', header: 'equipment-id'},
    {field: 'equipmentNo', header: 'equipment-no'},
    // {field: 'equipmentName', header: 'equipment-name'},
    {field: 'description', header: 'description'},
    {field: 'dataMinSquareError', header: 'datamin-square-error'},
    {field: 'totalErrorCount', header: 'total-error-count'},
    {field: 'validFrom', header: 'valid-from'},
    {field: 'equipmentCategory', header: 'category'},
    // {field: 'equipmentABCIndicator', header: 'abc-indicator'},
    // {field: 'planningPlant', header: 'planning-plant'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'maintenanceFuntionalLocation', header: 'functional-location'},
    {field: 'maintenanceWorkstation', header: 'maintenance-workstation'},
    // {field: 'maintenanceWorkstationPlant', header: 'maintenance-workstation-plant'},
    {field: 'equipmentObjectType', header: 'object-type'},
    {field: 'weight', header: 'weight'},
    {field: 'weightUnit', header: 'weight-unit'},
    {field: 'manufacturer', header: 'manufacturer'},
    {field: 'modelNumber', header: 'model'},
    {field: 'manufacturerPartNo', header: 'manufacturer-part-no'},
    {field: 'manufacturerSerialNo', header: 'manufacturer-serial-no'},
    {field: 'manufacturerMonth', header: 'manufacturer-month'},
    {field: 'manufacturerYear', header: 'manufacturer-year'},
    {field: 'manufacturerCountry', header: 'manufacturer-country'},
  ];


  selectedEquipments = [];
  equipments = [];
  listStatus;

  showLoader = false;
  sub: Subscription;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data?) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumEquipmentStatus: EnumService,
              private _translateSvc: TranslateService,
              private appStateService: AppStateService,
              private _equipmentSvc: EquipmentService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {
  }


  ngOnInit() {
    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (res) {
         // this.pageFilter.plantId = res.plantId;
         this.pageFilter.planningPlatId = res.plantId;
         //  this.pageFilter.plantName = res.plantName;
          this.filter(this.pageFilter);       
      }
    });
    this._enumEquipmentStatus.getEquipmentStatusList().then(result => this.listStatus = result).catch(error => console.log(error));
  }
  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter(data) {
    this.loaderService.showLoader();
    this._equipmentSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.equipments = result['content'].slice(0).sort((a,b) => b.equipmentId - a.equipmentId);
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
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
      equipmentNo: null,
      equipmentName: null,
      equipmentStatus: null,
      query: null,
      planningPlatId: null,
      orderByProperty: null,
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
  showFunctionalLocationDetail(abcIndicator){
    this.loaderService.showDetailDialog(DialogTypeEnum.FUNCTIONALLOCATION, abcIndicator)
  }

  showEquipmentDetail(abcIndicator){
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENT, abcIndicator)
  }
}
