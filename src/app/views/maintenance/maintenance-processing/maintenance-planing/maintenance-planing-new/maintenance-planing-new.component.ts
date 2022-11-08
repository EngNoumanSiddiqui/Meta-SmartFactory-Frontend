import { MaintenancePlanItemsService } from 'app/services/dto-services/maintenance/maintenance-plan-items.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {EquipmentService} from '../../../../../services/dto-services/equipment/equipment.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {WorkstationService} from '../../../../../services/dto-services/workstation/workstation.service';
import {MaintenancePlaningRequestDto, MaintenanceOrderPlanItemList, MaintenanceOrderPlanCycleItemList} from '../../../../../dto/maintenance/planing.dto';
import {MaintenancePlanTypeService} from '../../../../../services/dto-services/maintenance/maintenance-plan-types.service';
import {EquipmentPlannerGroupService} from '../../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {EquipmentAbcIndicatorService} from '../../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {PlantService} from '../../../../../services/dto-services/plant/plant.service';
import {MaintenanceItemService} from '../../../../../services/dto-services/maintenance/maintenance-item.service';
import {MaintenanceOrderTypeService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';
import {MaintenancePlaningService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-planing.service';
import { EquipmentTaskService } from 'app/services/dto-services/maintenance-equipment/equipment-task.service';
import { UsersService } from 'app/services/users/users.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'maintenance-planing-new',
  templateUrl: './maintenance-planing-new.component.html',
  styleUrls: ['./maintenance-planing-new.component.scss']
})
export class MaintenancePlaningNewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();

  dataModel: MaintenancePlaningRequestDto = new MaintenancePlaningRequestDto();
  maintenancePlanItem: MaintenanceOrderPlanItemList = new MaintenanceOrderPlanItemList();
  maintenancePlanCycleItem: MaintenanceOrderPlanCycleItemList = new MaintenanceOrderPlanCycleItemList();
  selectedEquipmentTask: any;
  selectedPlannerGroup: any;
  selectedFunctionalLocation: any;



  maintenanceOrderTypes;
  maintenanceActivityTypes;
 
  selectedIndex = 0;
  testObject = {
    maintenanceOrderPlanCycleItemList : [
       {
          counter: 90,
          cycle: 10,
          description: 'demo',
          maintenanceCycleText: 'DEmo222',
          offset: 20,
          offsetUnit: 'base'
       }
    ],
    maintenanceOrderPlanItemList: [
       {
          assembly: 'demo',
          equipmentId : 6,
          mainWorkStationId: 87,
          maintenanceFunctionalLocationId: 2,
          maintenanceOrderPlanTypeId: 5,
          maintenancePlannerGroupId: 4,
          planningPlantId: 4,
          priority: 'HIGH'
       }
    ],
    maintenancePlanPlanName: 'Demo',
    maintenanceOrderPlanTypeId: 5,
    maintenanceFunctionalLocationId: 3,
    equipmentId: 6,
    assembly: 'demoAssembly',
    planningPlantId: 3,
    mainWorkStationId: 87,
    priority: 'HIGH',
    maintenancePlannerGroupId: 5,
    maintenanceActivityTypeId: 1
 }

  selectedItem;
  functionalLocations: any[];
  equipmentList: any[];
  workstations: any[];
  maintenanceOrderPlanTypeList: any[];
  plannerGroup: any[];
  abcIndicators: any[];
  itemList: any[];
  selectedCyclePlanItemUnit;
  selectedCyclePlanItem;
  orderTypeList: any[];
  selectedOrderType;
  selectedWorkstation;
  dialog = {title: null, type: null, id: null, active: false};
  equipmModal = {active: false};
  cyclePlanItemList: any[];
  priority = [];
  equipmentTaskList: any;
  selectedPlant: any;
  schedulingEnumList = [];
  schedulingEnumSliceList = [];
  selectedEquipment: any;
  constructor(private functionalLocationService: FunctionalLocationService,
              private equipmentService: EquipmentService,
              private _maintenancePlanItemsService: MaintenancePlanItemsService,
              private utilities: UtilitiesService,
              private workstationService: WorkstationService,
              private maintenancePlanTypeService: MaintenancePlanTypeService,
              private plannerGroupService: EquipmentPlannerGroupService,
              private abcIndicatorService: EquipmentAbcIndicatorService,
              private plantService: PlantService,
              private maintenanceItemService: MaintenanceItemService,
              private _userSvc: UsersService,
              private loadingService: LoaderService,
              private mStrategyTypeSvc: EquipmentTaskService,
              private enumService: EnumService,
              private maintenanceOrderTypeService: MaintenanceOrderTypeService,
              private maintenancePlaningService: MaintenancePlaningService
  ) {
    const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }
   }

ngOnInit() {
    this.getFunctionalLocation();
    this.getEquipmentList();
    this.getWorkstation();
    this.getMaintenancePlanTypes();
    this.getAbcIndicator();
    this.getPlannerGroup();
    this.getItems();
 
    this.getMaintenancePlanitemList();


    
    this.enumService.getMaintenanceOrderTypeEnum().then(result => this.maintenanceOrderTypes = result).catch(error => console.log(error));
    this.enumService.getMaintenanceActivityTypeEnum().then(result => this.maintenanceActivityTypes = result).catch(error => console.log(error));

    this.mStrategyTypeSvc.filter({pageSize: 100000, pageNumber: 1}).then(res => {
      this.equipmentTaskList = res['content'];
    });
    this.enumService.getSchedulingIndicatorEnum().then((res: any) => {
      this.schedulingEnumList = res;
      this.schedulingEnumSliceList = this.schedulingEnumList.slice(0, this.schedulingEnumList.length - 1)
    });
    this.enumService.getMaintenanceNotificationPriorityEnum().then((res: any) => {
      this.priority = res.filter(itm => itm!== 'MIDIUM');
    });

    this.dataModel.schedulingPeriod = '1';
    this.dataModel.schedulingPeriodUnit = 'Day';

  }
getFunctionalLocation() {
    this.functionalLocationService.filterShared({pageSize: 100000, pageNumber: 1, planningPlantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.functionalLocations = r ? r['content'] : [];
      }).catch();
  }
getEquipmentList() {
    this.equipmentService.filterSharedObservable({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.equipmentList = r ? r['content'] : [];
      }).catch();
  }
getMaintenancePlanitemList() {
    this._maintenancePlanItemsService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant.plantId}).toPromise()
      .then(r => {
        this.cyclePlanItemList = r ? r['content'] : [];
      }).catch();
  }
getWorkstation() {
    this.workstationService.filterObservable({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant.plantId}).toPromise()
      .then(r => {
        this.workstations = r ? r['content'] : [];
      }).catch();
  }
getMaintenancePlanTypes() {
    this.maintenancePlanTypeService.getOrderTypeEnum().toPromise()
      .then((r: any) => {
        this.maintenanceOrderPlanTypeList = r ? r : [];
      }).catch();
  }
getPlannerGroup() {
    this.plannerGroupService.filterSharedObservable({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.plannerGroup = r ? r['content'] : [];
      }).catch();
  }

getAbcIndicator() {
    this.abcIndicatorService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.abcIndicators = r ? r['content'] : [];
      }).catch();
  }

  setSelectedPlanningPlant(event) {
    if (event) {
      this.dataModel.planningPlantId = event.plantId;
    }
  }
getItems() {
    this.maintenanceItemService.filterShared({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        if (r) {
          this.itemList = r as any[];
        }
      }).catch();
  }
getMaintenanceOrderType() {
    this.maintenanceOrderTypeService.filterSharedObservable({pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId}).toPromise()
      .then(r => {
        this.orderTypeList = r ? r['content'] : [];
      }).catch();
  }

  setEquipment(event) {
    if (event) {
      this.selectedEquipment = event;
      this.dataModel.equipmentId = event.equipmentId;
      this.maintenancePlanItem.equipmentId = event.equipmentId;
      this.maintenancePlanItem.equipmentName = event.equipmentName;

      this.selectedPlannerGroup = event.equipmentPlannerGroup;
      this.maintenancePlanItem.maintenancePlannerGroup = event.equipmentPlannerGroup;
      this.maintenancePlanItem.maintenancePlannerGroupId = event.equipmentPlannerGroup?.plannerGroupId;
      this.maintenancePlanItem.plannerGroupName = event.equipmentPlannerGroup?.plannerGroup;

      this.maintenancePlanItem.mainWorkStationId = event.maintenanceWorkstation?.workStationId;
      this.maintenancePlanItem.mainWorkStationName = event.maintenanceWorkstation?.workStationName;


    } else {
      this.maintenancePlanItem.equipmentId = null;
      this.maintenancePlanItem.equipmentName = null;
    }
  }
  setWorkstation(event) {
    if (event) {
      this.dataModel.mainWorkStationId = event.workStationId;
      this.maintenancePlanItem.mainWorkStationId = event.workStationId;
      this.maintenancePlanItem.mainWorkStationName = event.workStationName;
    } else {
      this.maintenancePlanItem.mainWorkStationId = null;
      this.maintenancePlanItem.mainWorkStationName = null;
    }
  }
  setPlant(event) {
    if (event) {
      this.maintenancePlanItem.planningPlantId = event.plantId;
      this.maintenancePlanItem.planningPlantName = event.plantName;
    } else {
      this.maintenancePlanItem.planningPlantId = null;
      this.maintenancePlanItem.planningPlantName = null;
    }
  }
  setMaintenanceOrderType(event) {
    if (event) {
      this.maintenancePlanItem.maintenanceOrderPlanType = event;
      this.maintenancePlanItem.maintenanceOrderPlanTypeId = event.maintenanceOrderTypeId;
    }
  }


  saveMaintenancePlan() {
    if ((this.dataModel.maintenanceOrderPlanTypeId === 'TIME_BASE_SINGLE_CYCLE_PLAN') || (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN')) {
      this.dataModel.maintenanceOrderPlanCycleItemList = [];
      this.dataModel.maintenanceOrderPlanCycleItemList.push(this.maintenancePlanCycleItem);
    }
    this.dataModel.maintenanceOrderPlanItemList.forEach(item => {
      if (item.maintenancePlannerGroup) {
        delete item.maintenancePlannerGroup;
      }
      if (item.maintenanceFunctionalLocation) {
        delete item.maintenanceFunctionalLocation;
      }
      if (item.equipmentTask) {
        delete item.equipmentTask;
      }
    });
    this.loadingService.showLoader();
    // if (this.dataModel.maintenanceOrderPlanCycleItemList && this.dataModel.maintenanceOrderPlanItemList.length > 0) {
        this.maintenancePlaningService.save(this.dataModel)
        .then((r: any) => {
          this.utilities.showSuccessToast('Success');
          this.maintenancePlaningService.getDetail(r.maintenancePlanId)
          .then(result => {
            this.assignToMainObject(result);
            setTimeout(() => {
              console.log(this.dataModel);
            }, 1000);
            setTimeout(() => {
              this.selectedIndex = 3;
            }, 1000);
          }).catch(error => {
            this.utilities.showErrorToast(error)
          });


          // this.dataModel.maintenancePlanId = r.maintenancePlanId;
          // this.saveAction.emit('close');

          this.loadingService.hideLoader();
        }).catch(e => {
          this.utilities.showErrorToast('Failed');
          this.loadingService.hideLoader();
        });
    // } else {
    //   this.utilities.showInfoToast('incomplete-data-orderplan-plan-cycle');
    // }
  }

  handleChange(e) {
    var index = e.index;
    this.selectedIndex = index;
  }

  reset() {
  }

  maintenancePlanCycleShow(id , type) {
    this.maintenancePlanCycleItem = new MaintenanceOrderPlanCycleItemList();
    if (this.selectedEquipmentTask.maintenanceStrategy) {
      // this.maintenancePlanCycleItem.maintenanceStrategyPackageId = this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyId;
      this.dataModel.callHorizan = this.selectedEquipmentTask.maintenanceStrategy.callHerizon;
      this.dataModel.schedulingIndicator = this.selectedEquipmentTask.maintenanceStrategy.schedulingIndicator;
      this.dataModel.shiftFactorLateCompletion = this.selectedEquipmentTask.maintenanceStrategy.shiftFactorForLateCompletion;
      this.dataModel.shiftFactorLateTolerance = this.selectedEquipmentTask.maintenanceStrategy.toleranceFactorForLateCompletion;
      this.dataModel.shiftFactorEarlyCompletion = this.selectedEquipmentTask.maintenanceStrategy.shiftFactorForEarlyCompletion;
      this.dataModel.shiftFactorEarlyTolerance = this.selectedEquipmentTask.maintenanceStrategy.toleranceFactorForEarlyCompletion;
      if (this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyPackageList && this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyPackageList.length > 0) {
        this.maintenancePlanCycleItem.maintenanceStrategyPackageId = this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyPackageList[0].maintenanceStrategyPackageId;
        this.maintenancePlanCycleItem.cycle = this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyPackageList[0].cycleLenght;
        this.maintenancePlanCycleItem.cycleUnit = this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyPackageList[0].cycleUnit;
        this.maintenancePlanCycleItem.maintenanceCycleText = this.selectedEquipmentTask.maintenanceStrategy.maintenanceStrategyPackageList[0].maintenanceCycleText;
      }

    }
    this.dialog.id = id;
    this.dialog.type = type;
    this.dialog.active = true;
  }
  editMaintenancePlanCycleShow (i, type) {
    this.maintenancePlanCycleItem = this.dataModel.maintenanceOrderPlanCycleItemList[i];
    this.dialog.type = type;
    this.dialog.active = true;
  }
  removeMaintenancePlanCycle(i) {
    this.dataModel.maintenanceOrderPlanCycleItemList.splice(i);
  }
  AddMaintenancePlanCycleItem() {
    this.dataModel.maintenanceOrderPlanCycleItemList.push(this.maintenancePlanCycleItem);
    this.dialog = {title: null, id: null, type: null, active: false};
  }
  EditMaintenancePlanCycleItem() {
    this.dataModel.maintenanceOrderPlanCycleItemList
    .splice(this.dataModel.maintenanceOrderPlanCycleItemList
      .indexOf(this.maintenancePlanCycleItem), 1, this.maintenancePlanCycleItem);
    this.dialog = {title: null, id: null, type: null, active: false};
  }

  onEquipmentTaskSelected(event) {
    if (event) {
      this.selectedEquipmentTask = event;
      this.maintenancePlanItem.equipmentTaskId = event.equipmentTaskId;
      this.maintenancePlanItem.equipmentTask = event;
    }
  }
  onMaintenanceOrderPlanTypeChanged(event) {
    if (this.selectedEquipmentTask) {
      this.assignEquipmentTaskRelatedValues(this.selectedEquipmentTask);
    }
    if (this.selectedEquipment) {
      if (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN') {
        if (this.selectedEquipment.equipmentMeasuringPointList && this.selectedEquipment.equipmentMeasuringPointList.length > 0) {
          this.maintenancePlanCycleItem.counter = this.selectedEquipment.equipmentMeasuringPointList[0].equipmentMeasuringPointNo;
        }
      }
      if (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_STRATEGY_PLAN'
      || this.dataModel.maintenanceOrderPlanTypeId === 'MULTIPLE_COUNTER_PLAN') {
        if (this.selectedEquipment.equipmentMeasuringPointList && this.selectedEquipment.equipmentMeasuringPointList.length > 0) {
          if (this.dataModel.maintenanceOrderPlanCycleItemList && this.dataModel.maintenanceOrderPlanCycleItemList.length > 0) {
            this.selectedEquipment.equipmentMeasuringPointList.length = this.dataModel.maintenanceOrderPlanCycleItemList.length;
            this.dataModel.maintenanceOrderPlanCycleItemList.forEach((itm, i) => {
              itm.counter = this.selectedEquipment.equipmentMeasuringPointList[i] ? this.selectedEquipment.equipmentMeasuringPointList[i].equipmentMeasuringPointNo : null;
            })
          }
        }
      }
    }
  }

  assignEquipmentTaskRelatedValues(event: any) {
    this.dataModel.equipmentTaskId = event.equipmentTaskId;
      this.maintenancePlanItem.equipmentTaskId = event.equipmentTaskId;
      this.maintenancePlanItem.equipmentTaskName = event.taskDescription;
      this.maintenancePlanItem.equipmentTask = event;
      if (event.maintenanceStrategy) {
        if (!(this.dataModel.maintenanceOrderPlanTypeId === 'TIME_BASE_SINGLE_CYCLE_PLAN'
        || this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN'
        || this.dataModel.maintenanceOrderPlanTypeId === 'MULTIPLE_COUNTER_PLAN')) {
          this.dataModel.callHorizan = event.maintenanceStrategy.callHerizon;
          this.dataModel.schedulingIndicator = event.maintenanceStrategy.schedulingIndicator;
          this.dataModel.shiftFactorLateCompletion = event.maintenanceStrategy.shiftFactorForLateCompletion;
          this.dataModel.shiftFactorLateTolerance = event.maintenanceStrategy.toleranceFactorForLateCompletion;
          this.dataModel.shiftFactorEarlyCompletion = event.maintenanceStrategy.shiftFactorForEarlyCompletion;
          this.dataModel.shiftFactorEarlyTolerance = event.maintenanceStrategy.toleranceFactorForEarlyCompletion;
        } else {
          this.dataModel.callHorizan = null;
          this.dataModel.schedulingIndicator = null;
          this.dataModel.shiftFactorLateCompletion = null;
          this.dataModel.shiftFactorLateTolerance = null;
          this.dataModel.shiftFactorEarlyCompletion = null;
          this.dataModel.shiftFactorEarlyTolerance = null;
        }

        if ((this.dataModel.maintenanceOrderPlanTypeId === 'TIME_BASE_SINGLE_CYCLE_PLAN')
        || (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN')) {
          this.maintenancePlanCycleItem.maintenanceStrategyPackageId = (event.maintenanceStrategy.maintenanceStrategyPackageList && event.maintenanceStrategy.maintenanceStrategyPackageList.length > 0)
          ? event.maintenanceStrategy.maintenanceStrategyPackageList[0].maintenanceStrategyPackageId : null;
          if (event.maintenanceStrategy.maintenanceStrategyPackageList && event.maintenanceStrategy.maintenanceStrategyPackageList.length > 0) {
            // this.maintenancePlanCycleItem.cycle = event.maintenanceStrategy.maintenanceStrategyPackageList[0].cycleLenght;
            // this.maintenancePlanCycleItem.cycleUnit = event.maintenanceStrategy.maintenanceStrategyPackageList[0].cycleUnit;
            // this.maintenancePlanCycleItem.maintenanceCycleText = event.maintenanceStrategy.maintenanceStrategyPackageList[0].maintenanceCycleText;
            // this.maintenancePlanCycleItem.offset = event.maintenanceStrategy.maintenanceStrategyPackageList[0].offset;
            // this.maintenancePlanCycleItem.offsetShortText = event.maintenanceStrategy.maintenanceStrategyPackageList[0].offsetShortText;
          } else {
            // this.maintenancePlanCycleItem.cycle = null;
            // this.maintenancePlanCycleItem.cycleUnit = null;
            // this.maintenancePlanCycleItem.maintenanceCycleText = null;
            // this.maintenancePlanCycleItem.offset = null;
            // this.maintenancePlanCycleItem.offsetShortText = null;
          }
        } else {
          if (event.maintenanceStrategy.maintenanceStrategyPackageList && event.maintenanceStrategy.maintenanceStrategyPackageList.length > 0) {
            this.dataModel.maintenanceOrderPlanCycleItemList = event.maintenanceStrategy.maintenanceStrategyPackageList.map(itm => ({
              counter: null,
              cycle: itm.cycleLenght,
              cycleUnit: itm.cycleUnit,
              description: null,
              maintenanceCycleItemId: null,
              maintenanceCycleText: itm.maintenanceCycleText,
              maintenancePlanId: null,
              maintenanceStrategyPackageId: itm.maintenanceStrategyPackageId,
              offset: itm.offset,
              offsetShortText: itm.offsetShortText,
            }));
          } else {
            this.dataModel.maintenanceOrderPlanCycleItemList = [];
          }
        }
      } else {
        this.maintenancePlanCycleItem.maintenanceStrategyPackageId = null;
        this.dataModel.callHorizan = null;
        this.dataModel.schedulingIndicator = null;
        this.dataModel.shiftFactorLateCompletion = null;
        this.dataModel.shiftFactorLateTolerance = null;
        this.dataModel.shiftFactorEarlyCompletion = null;
        this.dataModel.shiftFactorEarlyTolerance = null;
      }
  }

  onPlannerGroupSelected(event) {
    if (event) {
      this.dataModel.maintenancePlannerGroupId = event.plannerGroupId;
      this.maintenancePlanItem.maintenancePlannerGroupId = event.plannerGroupId;
      this.maintenancePlanItem.plannerGroupName = event.plannerGroup;
      this.maintenancePlanItem.maintenancePlannerGroup = event;
    }
  }
  onFunctionalLocationSelected(event) {
    if (event) {
      this.dataModel.maintenanceFunctionalLocationId = event.maintenanceFunctionalLocationId;
      this.maintenancePlanItem.maintenanceFunctionalLocationId = event.maintenanceFunctionalLocationId;
      this.maintenancePlanItem.maintenanceFunctionalLocationDesc = event.description;
      this.maintenancePlanItem.maintenanceFunctionalLocation = event;
    }
  }

  onSelectedMaintenanceActivityType(event) {
    if (event) {  
      this.maintenancePlanItem.maintenanceActivityType = event;
    }
  }

  onSelectedMaintenanceOrderType(event) {
    if (event) {  
      this.maintenancePlanItem.maintenanceOrderType = event;
    }
  }
  maintenancePlanShow(id , type) {
    this.maintenancePlanItem = new MaintenanceOrderPlanItemList();
    this.maintenancePlanItem.priority = 'MEDIUM';
    this.dialog.id = id;
    this.dialog.type = type;
    this.dialog.active = true;
    this.maintenancePlanItem.planningPlantId = this.selectedPlant ? this.selectedPlant.plantId : null;
    this.maintenancePlanItem.planningPlantName = this.selectedPlant ? this.selectedPlant.plantName : null;
    this.selectedEquipmentTask = null;
    this.selectedPlannerGroup = null;
    this.selectedFunctionalLocation = null;

  }
  editMaintenancePlanShow (i, type) {
    this.maintenancePlanItem = this.dataModel.maintenanceOrderPlanItemList[i];
    this.dialog.type = type;
    this.dialog.active = true;
    this.selectedEquipmentTask = this.maintenancePlanItem.equipmentTask;
    this.selectedPlannerGroup = this.maintenancePlanItem.maintenancePlannerGroup;
    this.selectedFunctionalLocation = this.maintenancePlanItem.maintenanceFunctionalLocation;
  }
  removeMaintenancePlan(i) {
    this.dataModel.maintenanceOrderPlanItemList.splice(i);
  }
  AddMaintenancePlanItem() {
    if (this.selectedEquipmentTask) {
      this.assignEquipmentTaskRelatedValues(this.selectedEquipmentTask);
    }
    if (this.selectedEquipment) {
      if (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN') {
        if (this.selectedEquipment.equipmentMeasuringPointList && this.selectedEquipment.equipmentMeasuringPointList.length > 0) {
          this.maintenancePlanCycleItem.counter = this.selectedEquipment.equipmentMeasuringPointList[0].equipmentMeasuringPointNo;
        }
      }
      if (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_STRATEGY_PLAN'
      || this.dataModel.maintenanceOrderPlanTypeId === 'MULTIPLE_COUNTER_PLAN') {
        if (this.selectedEquipment.equipmentMeasuringPointList && this.selectedEquipment.equipmentMeasuringPointList.length > 0) {
          if (this.dataModel.maintenanceOrderPlanCycleItemList && this.dataModel.maintenanceOrderPlanCycleItemList.length > 0) {
            this.selectedEquipment.equipmentMeasuringPointList.length = this.dataModel.maintenanceOrderPlanCycleItemList.length;
            this.dataModel.maintenanceOrderPlanCycleItemList.forEach((itm, i) => {
              itm.counter = this.selectedEquipment.equipmentMeasuringPointList[i] ? this.selectedEquipment.equipmentMeasuringPointList[i].equipmentMeasuringPointNo : null;
            })
          }
        }
      }
    }
    if (!this.maintenancePlanItem.equipmentTaskId) {
      this.utilities.showWarningToast('select-equipment-task');
      return ;
    } else if (!this.maintenancePlanItem.equipmentId) {
      this.utilities.showWarningToast('select-equipment');
      return ;
    } else if (!this.maintenancePlanItem.maintenancePlanItemName) {
      this.utilities.showWarningToast('maintenance-plan-name-required');
      return ;
    }
    this.dataModel.priority = this.maintenancePlanItem.priority;
    this.dataModel.mainWorkStationId = this.maintenancePlanItem.mainWorkStationId;
    this.dataModel.maintenancePlannerGroupId = this.maintenancePlanItem.maintenancePlannerGroupId;

    this.dataModel.maintenanceOrderPlanItemList.push(this.maintenancePlanItem);
    this.dialog = {title: null, id: null, type: null, active: false};
  }
  EditMaintenancePlanItem() {
    if (this.selectedEquipmentTask) {
      this.assignEquipmentTaskRelatedValues(this.selectedEquipmentTask);
    }
    if (this.selectedEquipment) {
      if (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_SINGLE_CYCLE_PLAN') {
        if (this.selectedEquipment.equipmentMeasuringPointList && this.selectedEquipment.equipmentMeasuringPointList.length > 0) {
          this.maintenancePlanCycleItem.counter = this.selectedEquipment.equipmentMeasuringPointList[0].equipmentMeasuringPointNo;
        }
      }
      if (this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_STRATEGY_PLAN'
      || this.dataModel.maintenanceOrderPlanTypeId === 'MULTIPLE_COUNTER_PLAN') {
        if (this.selectedEquipment.equipmentMeasuringPointList && this.selectedEquipment.equipmentMeasuringPointList.length > 0) {
          if (this.dataModel.maintenanceOrderPlanCycleItemList && this.dataModel.maintenanceOrderPlanCycleItemList.length > 0) {
            this.selectedEquipment.equipmentMeasuringPointList.length = this.dataModel.maintenanceOrderPlanCycleItemList.length;
            this.dataModel.maintenanceOrderPlanCycleItemList.forEach((itm, i) => {
              itm.counter = this.selectedEquipment.equipmentMeasuringPointList[i] ? this.selectedEquipment.equipmentMeasuringPointList[i].equipmentMeasuringPointNo : null;
            })
          }
        }
      }
    }
    if (!this.maintenancePlanItem.equipmentTaskId) {
      this.utilities.showWarningToast('select-equipment-task');
      return ;
    } else if (!this.maintenancePlanItem.equipmentId) {
      this.utilities.showWarningToast('select-equipment');
      return ;
    } else if (!this.maintenancePlanItem.maintenancePlanItemName) {
      this.utilities.showWarningToast('maintenance-plan-name-required');
      return ;
    }

    this.dataModel.maintenanceOrderPlanItemList
    .splice(this.dataModel.maintenanceOrderPlanItemList
      .indexOf(this.maintenancePlanItem), 1, this.maintenancePlanItem);

      this.dataModel.mainWorkStationId = this.maintenancePlanItem.mainWorkStationId;
      this.dataModel.maintenancePlannerGroupId = this.maintenancePlanItem.maintenancePlannerGroupId;
      this.dataModel.priority = this.maintenancePlanItem.priority;
    this.dialog = {title: null, id: null, type: null, active: false};
  }


  assignToMainObject(result) {
    if (result) {
      this.dataModel.maintenancePlanId = result['maintenancePlanId']
      this.dataModel.maintenancePlanPlanName = result['maintenancePlanPlanName'];
      this.dataModel.maintenanceOrderPlanTypeId = result['maintenanceOrderPlanType'];
      this.dataModel.schedulingIndicator = result['schedulingIndicator'];
      this.dataModel.schedulingPeriod = result['schedulingPeriod'];
      this.dataModel.schedulingPeriodUnit = result['schedulingPeriodUnit'];
      this.dataModel.shiftFactorEarlyCompletion = result['shiftFactorEarlyCompletion'];
      this.dataModel.shiftFactorEarlyTolerance = result['shiftFactorEarlyTolerance'];
      this.dataModel.shiftFactorLateCompletion = result['shiftFactorLateCompletion'];
      this.dataModel.shiftFactorLateTolerance = result['shiftFactorLateTolerance'];
      this.dataModel.maintenanceFunctionalLocationId = result['maintenanceFunctionalLocation'] ?  result['maintenanceFunctionalLocation'].maintenanceFunctionalLocationId : null;
      this.dataModel.completionRequirement = result['completionRequirement'];
      this.dataModel.createDate = result['createDate'];
      this.dataModel.cycleModificationFactor = result['cycleModificationFactor'];
      this.dataModel.cycleCompletionDate = result['cycleCompletionDate'];
      this.dataModel.startOfCycleCounter = result['startOfCycleCounter'];
      this.dataModel.startOfCycleCounterUnit = result['startOfCycleCounterUnit'];
      this.dataModel.startOfCycleDate = result['startOfCycleDate'] ? new Date(result['startOfCycleDate']) : null;
      this.dataModel.equipmentId = result['equipment'] ? result['equipment'].equipmentId : null;
      this.dataModel.priority = result['priority'];
      this.dataModel.assembly = result['assembly'];
      this.dataModel.mainWorkStationId = result['mainWorkStation'] ? Number(result['mainWorkStation'].workstationId) : null;
      this.dataModel.maintenancePlannerGroupId = result['maintenancePlannerGroup'] ? result['maintenancePlannerGroup'].plannerGroupId : null;
      this.dataModel.maintenanceOrderPlanCycleItemList = result['maintenanceOrderPlanCycleItemList'];
      // this.dataModel.maintenanceOrderPlanItemList = result['maintenanceOrderPlanItemList'];
      this.dataModel.planningPlantId = result['planningPlant'] ? result['planningPlant'].plantId : null;
      if (result['maintenanceOrderPlanItem'] && typeof result['maintenanceOrderPlanItem'] === 'object') {
        const orderplanItem: any = {
          assembly: result.maintenanceOrderPlanItem.assembly,
          createDate: result.maintenanceOrderPlanItem.createDate,
          equipmentId: result.maintenanceOrderPlanItem.equipment ? result.maintenanceOrderPlanItem.equipment.equipmentId : null,
          equipment: result.maintenanceOrderPlanItem.equipment ? result.maintenanceOrderPlanItem.equipment : null,
          equipmentName: result.maintenanceOrderPlanItem.equipment ? result.maintenanceOrderPlanItem.equipment.equipmentName : null,
          equipmentTaskId: result.maintenanceOrderPlanItem.equipmentTask ? result.maintenanceOrderPlanItem.equipmentTask.equipmentTaskId : null,
          equipmentTask: result.maintenanceOrderPlanItem.equipmentTask,
          equipmentTaskName: result.maintenanceOrderPlanItem.equipmentTask ? result.maintenanceOrderPlanItem.equipmentTask.taskDescription : null,
          maintenancePlanItemId: result.maintenanceOrderPlanItem.imaintenancePlanItemId,
          maintenancePlanItemName: result.maintenanceOrderPlanItem.maintenancePlanItemName,
          mainWorkStationId: result.maintenanceOrderPlanItem.mainWorkStation ? result.maintenanceOrderPlanItem.mainWorkStation.workStationId : null,
          mainWorkStationName: result.maintenanceOrderPlanItem.mainWorkStation ? result.maintenanceOrderPlanItem.mainWorkStation.workStationName : null,
          
          maintenanceFunctionalLocationId: result.maintenanceOrderPlanItem.maintenanceFunctionalLocation ? result.maintenanceOrderPlanItem.maintenanceFunctionalLocation.maintenanceFunctionalLocationId : null,
          maintenanceFunctionalLocation: result.maintenanceOrderPlanItem.maintenanceFunctionalLocation,
          maintenanceFunctionalLocationDesc: result.maintenanceOrderPlanItem.maintenanceFunctionalLocation ? result.maintenanceOrderPlanItem.maintenanceFunctionalLocation.description : null,
          maintenanceOrderPlanTypeId: result.maintenanceOrderPlanItem.maintenanceOrderType ? result.maintenanceOrderPlanItem.maintenanceOrderType.maintenanceOrderTypeId : null,
          maintenanceOrderPlanType: result.maintenanceOrderPlanItem.maintenanceOrderType,
          OrderPlandescription: result.maintenanceOrderPlanItem.maintenanceOrderPlanType ? result.maintenanceOrderPlanItem.maintenanceOrderPlanType.description : null,
          maintenancePlanId: result.maintenancePlanId,
          maintenanceActivityType: result.maintenanceOrderPlanItem.maintenanceActivityType,
          maintenanceOrderType: result.maintenanceOrderPlanItem.maintenanceOrderType,
          maintenancePlannerGroupId: result.maintenanceOrderPlanItem.maintenancePlannerGroup ? result.maintenanceOrderPlanItem.maintenancePlannerGroup.plannerGroupId : null,
          plannerGroupName: result.maintenanceOrderPlanItem.maintenancePlannerGroup ? result.maintenanceOrderPlanItem.maintenancePlannerGroup.plannerGroup : null,
          maintenancePlannerGroup: result.maintenanceOrderPlanItem.maintenancePlannerGroup,
          planningPlantId: result.maintenanceOrderPlanItem.planningPlant ? result.maintenanceOrderPlanItem.planningPlant.plantId : null,
          planningPlantName: result.maintenanceOrderPlanItem.planningPlant ? result.maintenanceOrderPlanItem.planningPlant.plantName : null,
          priority: result.maintenanceOrderPlanItem.priority,
          updateDate: result.maintenanceOrderPlanItem.updateDate
        }
        this.selectedEquipment = orderplanItem.equipment;
        this.selectedEquipmentTask = orderplanItem.equipmentTask;
        this.dataModel.maintenanceOrderPlanItemList.length = 0;
        this.dataModel.maintenanceOrderPlanItemList.push(orderplanItem);
      } else if (result['maintenanceOrderPlanItemList'] && result['maintenanceOrderPlanItemList'].length > 0) {
        this.dataModel.maintenanceOrderPlanItemList = result['maintenanceOrderPlanItemList'].map(itm => {
          return ({
            assembly: itm.assembly,
            createDate: itm.createDate,
            equipmentId: itm.equipment ? itm.equipment.equipmentId : null,
            equipmentName: itm.equipment ? itm.equipment.equipmentName : null,
            equipmentTaskId: itm.equipmentTask ? itm.equipmentTask.equipmentTaskId : null,
            equipmentTaskName: itm.equipmentTask ? itm.equipmentTask.taskDescription : null,
            maintenancePlanItemId: itm.imaintenancePlanItemId,
            mainWorkStationId: itm.mainWorkStation ? itm.mainWorkStation.workStationId : null,
            mainWorkStationName: itm.mainWorkStation ? itm.mainWorkStation.workStationName : null,
            maintenanceActivityTypeId: itm.maintenanceActivityType ? itm.maintenanceActivityType.maintenanceActivityTypeId : null,
            maintenanceFunctionalLocationId: itm.maintenanceFunctionalLocation ? itm.maintenanceFunctionalLocation.maintenanceFunctionalLocationId : null,
            maintenanceFunctionalLocationDesc: itm.maintenanceFunctionalLocation ? itm.maintenanceFunctionalLocation.description : null,
            maintenanceOrderPlanTypeId: itm.maintenanceOrderPlanType ? itm.maintenanceOrderPlanType.maintenancePlanTypeId : null,
            OrderPlandescription: itm.maintenanceOrderPlanType ? itm.maintenanceOrderPlanType.description : null,
            maintenancePlanId: itm.maintenancePlanId,
            maintenancePlannerGroupId: itm.maintenancePlannerGroup ? itm.maintenancePlannerGroup.plannerGroupId : null,
            plannerGroupName: itm.maintenancePlannerGroup ? itm.maintenancePlannerGroup.plannerGroup : null,
            planningPlantId: itm.planningPlant ? itm.planningPlant.plantId : null,
            planningPlantName: itm.planningPlant ? itm.planningPlant.plantName : null,
            priority: itm.priority,
            updateDate: itm.updateDate
          });
        })
      }

      if (!(this.dataModel.maintenanceOrderPlanTypeId === 'MULTIPLE_COUNTER_PLAN' || this.dataModel.maintenanceOrderPlanTypeId === 'TIME_BASED_STRATEGY_PLAN' || this.dataModel.maintenanceOrderPlanTypeId === 'PERFORMANCE_BASED_STRATEGY_PLAN')) {
        // this.maintenancePlanItem = this.dataModel.maintenanceOrderPlanItemList
        // && (this.dataModel.maintenanceOrderPlanItemList.length > 0) ?
        // this.dataModel.maintenanceOrderPlanItemList[0] : new MaintenanceOrderPlanItemList();
        this.maintenancePlanCycleItem = this.dataModel.maintenanceOrderPlanCycleItemList && (this.dataModel.maintenanceOrderPlanCycleItemList.length > 0)
          ? this.dataModel.maintenanceOrderPlanCycleItemList[0] : new MaintenanceOrderPlanCycleItemList();
      }

      // if (this.dataModel.maintenanceOrderPlanItemList && this.dataModel.maintenanceOrderPlanItemList.length > 0 ) {
        // const maintenanceOrderPlanObject: IMaintenanceOrderPlanItemList = result['maintenanceOrderPlanItemList'][0];
        // this.maintenancePlanItem = {
        //   assembly: maintenanceOrderPlanObject.assembly,
        //   createDate: maintenanceOrderPlanObject.createDate,
        //   equipmentId: (maintenanceOrderPlanObject.equipment) ? maintenanceOrderPlanObject.equipment.equipmentId : null,
        //   equipmentName: (maintenanceOrderPlanObject.equipment) ? maintenanceOrderPlanObject.equipment.equipmentName : null,
        //   imaintenancePlanItemId: (maintenanceOrderPlanObject.imaintenancePlanItemId) ? maintenanceOrderPlanObject.imaintenancePlanItemId : null,
        //   mainWorkStationId: (maintenanceOrderPlanObject.mainWorkStation) ? maintenanceOrderPlanObject.mainWorkStation.workStationId : null,
        //   mainWorkStationName: (maintenanceOrderPlanObject.mainWorkStation) ? maintenanceOrderPlanObject.mainWorkStation.workStationName : null,
        //   maintenanceActivityTypeId: (maintenanceOrderPlanObject.maintenanceActivityType) ? maintenanceOrderPlanObject.maintenanceActivityType.maintenanceActivityTypeId : null,
        //   maintenanceFunctionalLocationId: (maintenanceOrderPlanObject.maintenanceFunctionalLocation) ? maintenanceOrderPlanObject.maintenanceFunctionalLocation.maintenanceFunctionalLocationId : null,
        //   maintenanceOrderPlanTypeId: (maintenanceOrderPlanObject.maintenanceOrderPlanType) ? maintenanceOrderPlanObject.maintenanceOrderPlanType.maintenancePlanTypeId : null,
        //   // maintenancePlanId: (maintenanceOrderPlanObject.plan) ? maintenanceOrderPlanObject.equipment.equipmentId : null,
        //   maintenancePlannerGroupId: (maintenanceOrderPlanObject.maintenancePlannerGroup) ? maintenanceOrderPlanObject.maintenancePlannerGroup.plannerGroupId : null,
        //   planningPlantId: (maintenanceOrderPlanObject.planningPlant) ? maintenanceOrderPlanObject.planningPlant.plantId : null,
        //   planningPlantName: (maintenanceOrderPlanObject.planningPlant) ? maintenanceOrderPlanObject.planningPlant.plantName : null,
        //   priority: maintenanceOrderPlanObject.priority,
        //   updateDate: maintenanceOrderPlanObject.updateDate
        // }
      // }
      // this.maintenancePlanItem = (this.dataModel.maintenanceOrderPlanItemList && this.dataModel.maintenanceOrderPlanItemList.length > 0 ) ? this.dataModel.maintenanceOrderPlanItemList[0] : {} as MaintenanceOrderPlanItemList;
      // this.maintenancePlanCycleList = (this.dataModel.maintenanceOrderPlanCycleItemList && this.dataModel.maintenanceOrderPlanCycleItemList.length > 0 ) ? this.dataModel.maintenanceOrderPlanCycleItemList[0] : {} as MaintenanceOrderPlanCycleItemList;

      // if (this.dataModel.maintenanceOrderPlanCycleItemList && this.dataModel.maintenanceOrderPlanCycleItemList.length > 0 ) {
      //   const maintenanceOrderPlanCycleItemObject: IMaintenanceOrderPlanItemList = result['maintenanceOrderPlanCycleItemList'][0];
      // }
      console.log('@dataMode', this.dataModel);
    }
  }
}
