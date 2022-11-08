import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {EquipmentTaskService} from '../../../../../services/dto-services/maintenance-equipment/equipment-task.service';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'equipment-task-new',
  templateUrl: './new.component.html'
})
export class NewEquipmentTaskComponent implements OnInit, OnDestroy{

  @Output() saveAction = new EventEmitter<any>();
  activeTabIndex = 0;
  dataModel = {
    equipmentTaskId: null,
    equipmentId: null,
    equipmentPlannerGroupId: null,
    equipmentTaskType: {},
    equipmentPlannerGroup: null,
    group: null,
    groupCounter: null,
    maintenanceFunctionalLocationId: null,
    maintenanceStrategyId: null,
    maintenanceSystemConditionId: null,
    planningPlantId: null,
    taskCode: null,
    taskDescription: null,
    workStationId: null,
    active: false
  };
  equipmentTaskTypes;
  selectedEquipmentTaskType;
  selectedequipmentWorkstation;
  modal = {
    locationActive: false
  }
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private _userSvc: UsersService,
              private mStrategyService: EquipmentTaskService) {

                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }

  }

  ngOnInit() {

    this._enumSvc.getEquipmentTaskType().then(r => {
      this.equipmentTaskTypes = r;
      this.equipmentTaskTypes = this.equipmentTaskTypes.map(taskTypeObj => ({
          taskType: taskTypeObj
        }
      ));
    });
  }

  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
      this.dataModel.equipmentPlannerGroupId = equipment.equipmentPlannerGroup ? equipment.equipmentPlannerGroup.plannerGroupId : null;
      this.dataModel.equipmentPlannerGroup = equipment.equipmentPlannerGroup ? equipment.equipmentPlannerGroup : null;
      this.dataModel.workStationId = equipment.maintenanceWorkstation ? equipment.maintenanceWorkstation.workStationId : null;
      this.selectedequipmentWorkstation = equipment.maintenanceWorkstation;
    } else {
      this.dataModel.equipmentId = null;
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.dataModel.workStationId = event.workStationId;
    } else {
      this.dataModel.workStationId = null;

    }
  }

  setSelectedSystemCondition(event) {
    if (event) {
      this.dataModel.maintenanceSystemConditionId = event.maintenanceSystemConditionId;
    } else {
      this.dataModel.maintenanceSystemConditionId = null;

    }
  }

  setSelectedStrategy(event) {
    if (event) {
      this.dataModel.maintenanceStrategyId = event.maintenanceStrategyId;
    } else {
      this.dataModel.maintenanceStrategyId = null;

    }
  }

  setSelectedPlannerGroup(event) {
    if (event) {
      this.dataModel.equipmentPlannerGroupId = event.plannerGroupId;
    } else {
      this.dataModel.equipmentPlannerGroupId = null;

    }
  }

  setSelectedFunctionalLocation(event) {
    if (event) {
      this.dataModel.maintenanceFunctionalLocationId = event.maintenanceFunctionalLocationId;
    } else {
      this.dataModel.maintenanceFunctionalLocationId = null;

    }
  }


  setSelectedPlanningPlant(plant) {
    if (plant) {
      this.dataModel.planningPlantId = plant.plantId;
    } else {
      this.dataModel.planningPlantId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    this.dataModel.equipmentTaskType = this.selectedEquipmentTaskType.taskType;
    this.mStrategyService.save(this.dataModel)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.dataModel.equipmentTaskId = result.equipmentTaskId;
        setTimeout(() => {
          this.activeTabIndex = 1;
        }, 300);
        // setTimeout(() => {
        //   this.reset();
        //   this.saveAction.emit(result);
        // }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      equipmentTaskId: null,
      equipmentId: null,
      equipmentPlannerGroupId: null,
      equipmentTaskType: {},
      group: null,
      groupCounter: null,
      equipmentPlannerGroup : null,
      maintenanceFunctionalLocationId: null,
      maintenanceStrategyId: null,
      maintenanceSystemConditionId: null,
      planningPlantId: null,
      taskCode: null,
      taskDescription: null,
      workStationId: null,
      active: null
    };
    this.selectedEquipmentTaskType = null;
  }

  ngOnDestroy(): void {
    this.saveAction.emit('close');
  }
}
