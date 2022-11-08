import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from '../../../../../../environments/environment';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '../../../../../services/utilities.service';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { Subject } from 'rxjs';
import { ConvertUtil } from '../../../../../util/convert-util';
import { MaintenancePlaningService } from '../../../../../services/dto-services/maintenance-equipment/maintenance-planing.service';
import { MaintenanceOrderPlanContent } from 'app/dto/maintenance/maintenance-order-plan.dto';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance-planing-list',
  templateUrl: './maintenance-planing-list.component.html',
  styleUrls: ['./maintenance-planing-list.component.scss']
})
export class MaintenancePlaningListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;

  dialogModal = {
    modal: null,
    id: null,
    data: null
  };


  tableData: MaintenanceOrderPlanContent[] = [];
  selectedData = [];
  selectedColumns = [
    { field: 'maintenancePlanId', header: 'maintenance-plan-id' },
    { field: 'maintenancePlanPlanName', header: 'maintenance-plan-name' },
    { field: 'maintenanceOrderPlanType', header: 'maintenance-plan-type' },
    { field: 'maintenanceFunctionalLocationId', header: 'maintenance-functional-location' },
    { field: 'equipmentName', header: 'equipment' },
    // {field: 'planningPlant', header: 'planning-plant'},
    { field: 'mainWorkStation', header: 'main-workstation' },
    { field: 'priority', header: 'priority' },
    { field: 'plannerGroup', header: 'planner-group' },
  ];
  cols = [
    { field: 'maintenancePlanId', header: 'maintenance-plan-id' },
    { field: 'maintenancePlanPlanName', header: 'maintenance-plan-name' },
    { field: 'maintenanceOrderPlanType', header: 'maintenance-plan-type' },
    { field: 'maintenanceFunctionalLocationId', header: 'maintenance-functional-location' },
    { field: 'equipmentName', header: 'equipment' },
    { field: 'planningPlant', header: 'planning-plant' },
    { field: 'mainWorkStation', header: 'main-workstation' },
    { field: 'priority', header: 'priority' },
    { field: 'plannerGroup', header: 'planner-group' },

  ];

  modal = { active: false };
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
    assembly: null,
    calHorizon: null,
    completionRequirement: null,
    createDate: null,
    cycleCompletionDate: null,
    cycleModificationFactor: null,
    equipmentId: null,
    equipmentName: null,
    equipmentTaskId: null,
    mainWorkStationId: null,
    maintenanceActivityTypeId: null,
    maintenanceFunctionalLocationId: null,
    maintenanceOrderPlanTypeId: null,
    maintenanceOrderTypeId: null,
    maintenancePlanId: null,
    maintenancePlanPlanName: null,
    maintenancePlannerGroupId: null,
    planningPlantId: null,
    planningPlantName: null,
    priority: null,
    schedulingIndicator: null,
    schedulingPeriod: null,
    schedulingPeriodUnit: null,
    shiftFactorEarlyCompletion: null,
    shiftFactorEarlyTolerance: null,
    shiftFactorLateCompletion: null,
    shiftFactorLateTolerance: null,
    startOfCycleCounter: null,
    startOfCycleCounterUnit: null,
    plantId: null,
    startOfCycleDate: null,
    updateDate: null,
    workStationName: null,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    query: null,
    orderByProperty: 'maintenancePlanId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc'];
  private searchTerms = new Subject<any>();
  priorityList = [];
  planTypeList: any;

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private appStateService: AppStateService,
    private maintenancePlaningService: MaintenancePlaningService
  ) {
    this.appStateService.plantAnnounced$.subscribe(res => {
      //console.log("@res",res);
      if (!(res)) {
        this.resetFilter();
        this.search(this.pageFilter);
      }
      else {
        // this.pageFilter.plantId = res.plantId;
        this.pageFilter.planningPlantId = res.plantId;
        this.pageFilter.planningPlantName = res.plantName;
        this.search(this.pageFilter);
      }
    });
  }

  ngOnInit() {
    //console.log("mmmm");
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.maintenancePlaningService.filterObservable(this.pageFilter))).subscribe(
        result => {
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.tableData = result['content'];
          this.loaderService.hideLoader();
        },
        error => {
          this.tableData = [];
          this.utilities.showErrorToast(error)
          this.loaderService.hideLoader();
        }
      );
    this.filter(this.pageFilter);

    this.enumService.getMaintenanceNotificationPriorityEnum().then((res: any) => {
      this.priorityList = res;
    });
    this.enumService.getMaintenanceOrderPlanTypeEnum().then((res: any) => {
      this.planTypeList = res;
    });
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }

  onColumnChanged(event) {

    if (this.selectedColumns.findIndex(itm => itm.field === 'maintenancePlanId') !== -1) {
      this.selectedColumns.splice(0, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'maintenancePlanId'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'maintenancePlanPlanName') !== -1) {
      this.selectedColumns.splice(1, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'maintenancePlanPlanName'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'maintenanceOrderPlanType') !== -1) {
      this.selectedColumns.splice(2, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'maintenanceOrderPlanType'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'maintenanceFunctionalLocationId') !== -1) {
      this.selectedColumns.splice(3, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'maintenanceFunctionalLocationId'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'equipmentName') !== -1) {
      this.selectedColumns.splice(4, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'equipmentName'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'planningPlant') !== -1) {
      this.selectedColumns.splice(5, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'planningPlant'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'mainWorkStation') !== -1) {
      this.selectedColumns.splice(6, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'mainWorkStation'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'priority') !== -1) {
      this.selectedColumns.splice(7, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'priority'), 1)[0])
    }
    if (this.selectedColumns.findIndex(itm => itm.field === 'plannerGroup') !== -1) {
      this.selectedColumns.splice(8, 0,
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'plannerGroup'), 1)[0])
    }
    // this.selectedColumns.sort(function(a, b) {
    //   let returnVal = 0;
    //   if (a.field.match(/maintenancePlanId/)) {
    //     returnVal = returnVal - 1;
    //   }
    //   if (b.field.match(/maintenancePlanId/)) {
    //       returnVal = returnVal + 1;
    //   }
    //   return returnVal;
    // })
  }

  filterByColumn(value, field) {
    let searchedValue = null;
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    } else {
      // i used switch for plantypeid and functionlocation id we have shown their description to the user 
      // if user will search in table so they will search by looking at description so thats why i wrote the code to 
      // find if order plan description contains this string to get its orderplan id and assign to pagefilter.maintenanceorderplainid
      switch (field) {
        case 'maintenanceOrderPlanTypeId':
          this.tableData.forEach(itm => {
            if (itm.maintenanceOrderPlanType.description.toLowerCase().includes(value)) {
              searchedValue = itm.maintenanceOrderPlanType.maintenancePlanTypeId;
              return;
            }
          });
          // if searched value couldnt found to i assigned  null instead of value from user input.
          this.pageFilter[field] = searchedValue ? searchedValue : null;
          this.filter(this.pageFilter);
          return; /// i used return to go out from this method cz i dont want to run the last two statements
          break;
        case 'maintenanceFunctionalLocationId':
          this.tableData.forEach(itm => {
            if (itm.maintenanceFunctionalLocation.description) {
              if (itm.maintenanceFunctionalLocation.description.toLowerCase().includes(value)) {
                searchedValue = itm.maintenanceFunctionalLocation.maintenanceFunctionalLocationId;
                return;
              }
            }
          });
          this.pageFilter[field] = searchedValue ? searchedValue : null;
          this.filter(this.pageFilter);
          return;
          break;
        default:
          break;
      }
    }
    this.pageFilter[field] = searchedValue ? searchedValue : value;
    this.filter(this.pageFilter);
  }
  modalShow(id, mod: string, data) {
    this.dialogModal.id = id;
    this.dialogModal.modal = mod;
    this.dialogModal.data = data;
    this.modal.active = true;
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
      assembly: null,
      calHorizon: null,
      completionRequirement: null,
      createDate: null,
      cycleCompletionDate: null,
      cycleModificationFactor: null,
      equipmentId: null,
      plantId: null,
      equipmentName: null,
      equipmentTaskId: null,
      mainWorkStationId: null,
      maintenanceActivityTypeId: null,
      maintenanceFunctionalLocationId: null,
      maintenanceOrderPlanTypeId: null,
      maintenanceOrderTypeId: null,
      maintenancePlanId: null,
      maintenancePlanPlanName: null,
      maintenancePlannerGroupId: null,
      planningPlantId: null,
      planningPlantName: null,
      priority: null,
      schedulingIndicator: null,
      schedulingPeriod: null,
      schedulingPeriodUnit: null,
      shiftFactorEarlyCompletion: null,
      shiftFactorEarlyTolerance: null,
      shiftFactorLateCompletion: null,
      shiftFactorLateTolerance: null,
      startOfCycleCounter: null,
      startOfCycleCounterUnit: null,
      startOfCycleDate: null,
      updateDate: null,
      workStationName: null,
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      query: null,
      orderByProperty: 'maintenancePlanId',
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
        this.maintenancePlaningService.delete(id)
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
  /***********test comment to see  */

  showMaintenancePlanTypeDetail(planType) {
    this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCPLANNINGTYPE, planType)
  }
  showEquipmentDetail(equipmentId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENT, equipmentId)
  }
  showPlantDetail(plantId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId)
  }
  showMaintenanceFunctionalLocationDetail(functionalLocation) {
    this.loaderService.showDetailDialog(DialogTypeEnum.FUNCTIONALLOCATION, functionalLocation)
  }
  showWorkStationDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId)
  }
}
