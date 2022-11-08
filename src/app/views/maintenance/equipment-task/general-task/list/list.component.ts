/**
 * Created by reis on 29.07.2019.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {EquipmentTaskService} from '../../../../../services/dto-services/maintenance-equipment/equipment-task.service';
import {environment} from '../../../../../../environments/environment';
import {ConvertUtil} from '../../../../../util/convert-util';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';
import { EquipmentTaskResponseObject, EquipmentTaskContent } from '../../../../../dto/equipment-task/equipment-task.model';
import { maintenanceStrategyPackageListDto } from '../../../../../dto/maintenance/strategy.dto';
import { WorkstationService } from '../../../../../services/dto-services/workstation/workstation.service';
import { TaskOperationService } from '../../../../../services/dto-services/maintenance-equipment/task-operation.service';
import { MaintenanceStrategyPackageService } from '../../../../../services/dto-services/maintenance/maintenance-strategy-package.service';

import {Subject, forkJoin} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EquipmenttaskOperationStrCycleService } from 'app/services/dto-services/equipment/equipment-operation-strategy-cycle.service';

@Component({
  selector: 'equipment-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EquipmentTaskListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null,
    data: null
  };
  packageModal = false;
  packageDialog = false;
  private searchTerms = new Subject<any>();
  tableData: EquipmentTaskContent[] = [];
  packageDataModel: maintenanceStrategyPackageListDto = new maintenanceStrategyPackageListDto();
  selectedData: any = null;
  selectedColumns = [
    {field: 'equipmentTaskId', header: 'equipment-task-id'},
    // {field: 'taskDescription', header: 'equipment-task-name'},
    // {field: 'equipmentId', header: 'equipmentId'},
    {field: 'equipment', header: 'equipment'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'equipmentTaskType', header: 'task-type'},
    // {field: 'group', header: 'group'},
    {field: 'groupCounter', header: 'group-counter'},
    {field: 'maintenanceFunctionalLocation', header: 'functional-location'},
    {field: 'maintenanceStrategy', header: 'maintenance-strategy'},
    {field: 'maintenanceSystemCondition', header: 'system-condition'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'workStation', header: 'workstation'},
    {field: 'taskCode', header: 'task-code'}
  ];
  cols = [
    {field: 'equipmentTaskId', header: 'equipment-task-id'},
    {field: 'taskDescription', header: 'equipment-task-name'},
    {field: 'equipmentId', header: 'equipmentId'},
    {field: 'equipment', header: 'equipment'},
    {field: 'equipmentPlannerGroup', header: 'planner-group'},
    {field: 'equipmentTaskType', header: 'task-type'},
    // {field: 'group', header: 'group'},
    {field: 'groupCounter', header: 'group-counter'},
    {field: 'maintenanceFunctionalLocation', header: 'functional-location'},
    {field: 'maintenanceStrategy', header: 'maintenance-strategy'},
    {field: 'maintenanceSystemCondition', header: 'system-condition'},
    {field: 'planningPlant', header: 'planning-plant'},
    {field: 'workStation', header: 'workstation'},
    {field: 'taskCode', header: 'task-code'},
  ];

  modal = {active: false};
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    equipmentTaskId: null,
    equipmentName: null,
    equipmentPlannerGroupId: null,
    maintenanceFunctionalLocationId: null,
    maintenanceStrategyId: null,
    maintenanceSystemConditionId: null,
    equipmentTaskType: null,
    planningPlantName: null,
    group: null,
    groupCounter: null,
    taskCode: null,
    taskDescription: null,
    workStationName: null,
    query: null,
    orderByProperty: 'equipmentTaskId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  equipmentTaskTypes;
  unitList;

  equipmentTaskOperationList = [];
  // selectedEquipmentTaskOperationList = [];
  flag: boolean;
  maintenanceStrgPackgList = [];
  equimentoperationDtoList: {
    active: boolean,
    equipmentTaskOperationId: number,
    equipmentTaskOperationStrategyCycleId: number, maintenanceStrategyPackageId: number} [] = [];
  equimentoperationForApiCallList = [];
  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private workstationService: WorkstationService,
              private loaderService: LoaderService,
              private _enumSvc: EnumService,
              private equipTaskOperationService: TaskOperationService,
              private appStateService: AppStateService,
              private maintenanceStrategyPackageService: MaintenanceStrategyPackageService,
              private equipmentTaskoperationStrategyCycle: EquipmenttaskOperationStrCycleService,
              private mStrategyTypeSvc: EquipmentTaskService) {
                this.appStateService.plantAnnounced$.subscribe(res => {
                  if (!(res)) {
                    this.resetFilter();
                    this.filter(this.pageFilter);
                  } else {
                    // this.pageFilter.plantId = res.plantId;
                    // this.pageFilter.planningPlantName = res.plantId;
                    this.pageFilter.planningPlantName = res.plantName;
                    this.filter(this.pageFilter);
                  }
                });
  }


  ngOnInit() {
    this._enumSvc.getEquipmentTaskType().then(r => {
      this.equipmentTaskTypes = r;
    });
    this.workstationService.getWorkstationUnitList().then(result => this.unitList = result).catch(error => console.log(error));
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.mStrategyTypeSvc.filterObservable(this.pageFilter))).subscribe(
      (result: EquipmentTaskResponseObject) => {
        this.pagination.currentPage = result.currentPage;
        this.pagination.totalElements = result.totalElements;
        this.pagination.totalPages = result.totalPages;
        this.tableData = result.content;
        this.loaderService.hideLoader();
      },
      error => {
        this.tableData = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

    // forkJoin([
    //   this.equipTaskOperationService.filterObservable({pageSize: 100000, pageNumber: 1}),
    //   this.maintenanceStrategyPackageService.filterObservable({pageSize: 100000, pageNumber: 1})
    //  ]).toPromise().then(data => {
    //   //  this.loaderService.hideLoader();
    //   if (data && data[0].content) {
    //     this.equipmentTaskOperationList = data[0]['content'];
    //   }
    //   if (data && data[1].content) {
    //     this.maintenanceStrgPackgList = data[1]['content'];
    //   }
    //    console.log('FullData : ' , data);
    //   //  this.packageDialog = true;
    // }).catch(err => console.error(err));

    this.filter(this.pageFilter);
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }
  openMaintenanceDialog() {
    // this.loaderService.showLoader();
    // console.log('Selected Data', this.selectedData);
    // this.selectedEquipmentTaskOperationList = [];
    this.equipmentTaskOperationList = [];
    this.loaderService.showLoader();
    forkJoin([
      this.equipTaskOperationService.filterObservable({pageSize: 100000, pageNumber: 1,
         equipmentTaskId: this.selectedData.equipmentTaskId}),
      this.maintenanceStrategyPackageService.filterObservable({pageSize: 100000, pageNumber: 1,
        maintenanceStrategyId: this.selectedData?.maintenanceStrategy?.maintenanceStrategyId})
     ]).toPromise().then(data => {
      //  this.loaderService.hideLoader();
      if (data && data[0].content) {
        this.equipmentTaskOperationList = data[0]['content'];
      }
      if (data && data[1].content) {
        this.maintenanceStrgPackgList = data[1]['content'];
      }

    this.assigntoOperationDtoList();

    forkJoin(this.equimentoperationForApiCallList
      .map(itm => this.equipmentTaskoperationStrategyCycle
        .filterObservable({pageNumber: 1, pageSize: 1000,
          equipmentTaskOperationId: itm.equipmentTaskOperationId,
          maintenanceStrategyPackageId: itm.maintenanceStrategyPackageId})))
    .toPromise().then(cycleList => {
      if (cycleList) {
        let multipleArray = cycleList.map(itm => itm.content);
      multipleArray =  multipleArray.reduce((r, e) => (r.push(...e), r), []);
      // this.utilities.showSuccessToast('add-successfully');
      this.equimentoperationDtoList = multipleArray.map(itm => {
        return {
          active: itm.active,
          equipmentTaskOperationId: itm.equipmentTaskOperation ? itm.equipmentTaskOperation.equipmentTaskOperationId : null,
          equipmentTaskOperationStrategyCycleId: itm.equipmentTaskOperationStrategyCycleId,
          maintenanceStrategyPackageId: itm.maintenanceStrategyPackage ? itm.maintenanceStrategyPackage.maintenanceStrategyPackageId : null
        };
      });
      console.log(this.equimentoperationDtoList);
      }
      this.loaderService.hideLoader();
      this.packageModal = true;
    }).catch(err => console.error(err));
      // this.selectedEquipmentTaskOperationList = this.equipmentTaskOperationList.filter(obj => obj.equipmentTask !== null && obj.equipmentTask.equipmentTaskId === this.selectedData.equipmentTaskId);

    }).catch(err => console.error(err));
  }

  assigntoOperationDtoList() {
    if (this.equipmentTaskOperationList && this.equipmentTaskOperationList.length > 0) {
      for (let i = 0; i < this.equipmentTaskOperationList.length; i++) {
        const equipmentTaskOprItem = this.equipmentTaskOperationList[i];

        for (let j = 0; j < this.maintenanceStrgPackgList.length; j++) {
          const maintenanceStrgPackgItm = this.maintenanceStrgPackgList[j];
          const eqptskoprcycle = this.equimentoperationDtoList
          .find(itm => (itm.equipmentTaskOperationId === equipmentTaskOprItem.equipmentTaskOperationId) &&
          (itm.maintenanceStrategyPackageId === maintenanceStrgPackgItm.maintenanceStrategyPackageId))
          if (!eqptskoprcycle) {
            const dto = {
              equipmentTaskOperationId: equipmentTaskOprItem.equipmentTaskOperationId,
              equipmentTaskOperationStrategyCycleId: null,
              maintenanceStrategyPackageId: maintenanceStrgPackgItm.maintenanceStrategyPackageId
            };
            this.equimentoperationForApiCallList.push(dto);
          }
        }

      }
    }
  }
  search(data) {
    this.loaderService.showLoader();

    this.searchTerms.next(data);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;

    this.modal.active = true;
  }

  isMaintenanceStrtegyPresent = (maintenanceStrategyPackageId, equipmentTaskId, equipmentTaskOperationId):  boolean => {
    if (!maintenanceStrategyPackageId && !equipmentTaskId) {
      return false;
    }
    if (this.equimentoperationDtoList) {
      const eqptskoprcycle = this.equimentoperationDtoList
      .find(itm =>  (itm.equipmentTaskOperationId === equipmentTaskOperationId) && (itm.maintenanceStrategyPackageId === maintenanceStrategyPackageId));
      // || (itm.equipmentTaskOperationStrategyCycleId === equipmentTaskOperationStrategyCycleId)))
      if (eqptskoprcycle && eqptskoprcycle.active) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  addEquiptaskOperationStrtgCycle($event , maintenanceStrategyPackageId, equipmentTaskOperationId) {
    if ($event.target.checked === true) {

      // if (!equipmentTaskOperationStrategyCycleId) {

      // }
      const eqptskoprcycle = this.equimentoperationDtoList
      .find(itm => (itm.equipmentTaskOperationId === equipmentTaskOperationId) && (itm.maintenanceStrategyPackageId === maintenanceStrategyPackageId))
      if (eqptskoprcycle) {
        return;
      } else {
        const dto = {
          active : true,
          equipmentTaskOperationId: equipmentTaskOperationId,
          equipmentTaskOperationStrategyCycleId: null,
          maintenanceStrategyPackageId: maintenanceStrategyPackageId
        };
        this.equimentoperationDtoList.push(dto);
      }
      // this.equipTaskOperationService.save(dto).then(data => {
      // }).catch(err => console.error(err));

    } else {
      const item = this.equimentoperationDtoList
      .find(itm => (itm.equipmentTaskOperationId === equipmentTaskOperationId) &&
      (itm.maintenanceStrategyPackageId === maintenanceStrategyPackageId))
      if (item) {
        this.equimentoperationDtoList.splice(this.equimentoperationDtoList.indexOf(item), 1, {...item, active: false});
        // const dto = {
        //   equipmentTaskOperationId: equipmentTaskOperationId,
        //   equipmentTaskOperationStrategyCycleId: equipmentTaskOperationStrategyCycleId,
        //   maintenanceStrategyPackageId: null
        // };
        // this.equimentoperationDtoList.push(dto);
      }
      // if (eqptskoprcycle) {
      //   this.equimentoperationDtoList.splice(this.equimentoperationDtoList.indexOf(eqptskoprcycle), 1 )
      //   this.equimentoperationDtoList.push({...eqptskoprcycle, maintenanceStrategyPackageId : null });
      // }
    }
    console.log(this.equimentoperationDtoList);
  }
  submitEquiptaskOperationStrtgCycle(myPackageModal) {
    this.loaderService.showLoader();
    forkJoin(this.equimentoperationDtoList.map(itm => this.equipmentTaskoperationStrategyCycle.saveObservable(itm)))
    .toPromise().then(data => {
      this.utilities.showSuccessToast('add-successfully');
      this.loaderService.hideLoader();
      myPackageModal.hide();
      this.equimentoperationDtoList = [];
      this.equimentoperationForApiCallList = [];
    }).catch(err => console.error(err));

  }
  openMaintenancePackageModal(rowData: EquipmentTaskContent) {
    this.packageDataModel.maintenanceStrategyId = rowData.maintenanceStrategy.maintenanceStrategyId;
    this.packageDialog = true;
  }
  openDetailsOfSelectedRow(rowData: EquipmentTaskContent) {
    if (rowData.maintenanceStrategy && rowData.maintenanceStrategy.maintenanceStrategyId) {
      // this.modalShow(rowData.equipmentTaskId, 'DETAIL', rowData);
      this.selectedData = rowData;
      // this.packageDataModel.maintenanceStrategyId = rowData.maintenanceStrategy.maintenanceStrategyId;
      // this.packageDialog = true;
    } else {
      this._confirmationSvc.confirm({
        message: this._translateSvc.instant('please-add-maintenance-strategy-first'),
        header: this._translateSvc.instant('please-add'),
        icon: 'fa fa-edit',
        accept: () => {
          this.modalShow(rowData.equipmentTaskId, 'EDIT', null);
          // this.packageDataModel.maintenanceStrategyId = rowData.maintenanceStrategy.maintenanceStrategyId;
          // this.packageDialog = true;
        },
        reject: () => {
          this.selectedData = null;
        }
      })
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
    this.search(this.pageFilter)
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
      equipmentTaskId: null,
      equipmentName: null,
      equipmentPlannerGroupId: null,
      maintenanceFunctionalLocationId: null,
      maintenanceStrategyId: null,
      maintenanceSystemConditionId: null,
      equipmentTaskType: null,
      planningPlantName: null,
      group: null,
      groupCounter: null,
      taskCode: null,
      taskDescription: null,
      workStationName: null,
      query: null,
      orderByProperty: 'equipmentTaskId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.mStrategyTypeSvc.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-task');
      }
    })
  }
  addMaintenanceStrategyPackage() {
    this.loaderService.showLoader();
    this.mStrategyTypeSvc.saveMaintenancePackage(this.packageDataModel).then((data: any) => {
      this.loaderService.hideLoader();
      this.packageDialog = false;
      this.resetNewItemDetails();

      // data has not maintenanceStrategyId thats why i retreive data from server instead of pushing data to packagelist
      // this.tableData.forEach(itm => {
      //   if ( data.maintenanceStrategyId === itm.maintenanceStrategy.maintenanceStrategyId) {
      //     itm.maintenanceStrategy.maintenanceStrategyPackageList.push(data);
      //   }
      // });
      this.filter(this.pageFilter);
    }).catch((error) => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }
  resetNewItemDetails() {
    const maintenanceStrategyId = this.packageDataModel.maintenanceStrategyId;
    this.packageDataModel = new  maintenanceStrategyPackageListDto();
    this.packageDataModel.maintenanceStrategyId = maintenanceStrategyId;
  }

  showEquipmentDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENT, id);
  }

  showEquipmentPlannerGroup(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANNERGROUP, id);
  }

  showMaintenanceFunctionalLocationDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.FUNCTIONALLOCATION, id);
  }

  showMaintenanceStrategyDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCESTRATEGY, id);
  }

  showMaintenanceSystemConditionDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCESYSTEMCONDITION, id);
  }

  showPlanningPlantDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, id);
  }

  showWorkStationDetail(id){
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, id);
  }

  checkSelectedData() {
    if (!this.selectedData) {
      return true;
    }
    if (this.selectedData) {
      if (this.selectedData.length === 0) {
        return true;
      } else {
        return this.selectedData.length > 1;
      }
    }
  }
}

