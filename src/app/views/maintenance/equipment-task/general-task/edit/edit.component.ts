import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentTaskService} from '../../../../../services/dto-services/maintenance-equipment/equipment-task.service';
import {EnumService} from '../../../../../services/dto-services/enum/enum.service';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'equipment-task-edit',
  templateUrl: './edit.component.html'
})
export class EditEquipmentTaskComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  modal = {
    locationActive: false
  }
  dataModel = {
    equipmentId: null,
    equipmentTaskId: null,
    equipmentPlannerGroupId: null,
    equipmentTaskType: {},
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
  detailData;
  equipmentTaskTypes;
  selectedEquipmentTaskType = {
    taskType: null
  };


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
    // this.initialize(this.id);
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(this.id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if (result) {
          this.dataModel.active = result['active'];
          if (result['equipment']) {
            this.dataModel.equipmentId = result['equipment'].equipmentId;
          }
          if (result['equipmentTaskId']) {
            this.dataModel.equipmentTaskId = result['equipmentTaskId'];
          }
          if (result['group']) {
            this.dataModel.group = result['group'];
          }
          if (result['groupCounter']) {
            this.dataModel.groupCounter = result['groupCounter'];
          }
          if (result['taskCode']) {
            this.dataModel.taskCode = result['taskCode'];
          }
          if (result['taskDescription']) {
            this.dataModel.taskDescription = result['taskDescription'];
          }
          if (result['equipmentTaskType']) {
            this.dataModel.equipmentTaskType = result['equipmentTaskType'];
            this.selectedEquipmentTaskType.taskType =  this.dataModel.equipmentTaskType;
          }
          if (result['equipmentPlannerGroup']) {
            this.dataModel.equipmentPlannerGroupId = result['equipmentPlannerGroup'].plannerGroupId;
          }
          if (result['maintenanceFunctionalLocation']) {
            this.dataModel.maintenanceFunctionalLocationId = result['maintenanceFunctionalLocation'].maintenanceFunctionalLocationId;
          }
          if (result['maintenanceStrategy']) {
            this.dataModel.maintenanceStrategyId = result['maintenanceStrategy'].maintenanceStrategyId;
          }
          if (result['maintenanceSystemCondition']) {
            this.dataModel.maintenanceSystemConditionId = result['maintenanceSystemCondition'].maintenanceSystemConditionId;
          }
          if (result['planningPlant']) {
            this.dataModel.planningPlantId = result['planningPlant'].plantId;
          }
          if (result['workStation']) {
            this.dataModel.workStationId = result['workStation'].workStationId;
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
      this.dataModel.equipmentPlannerGroupId = equipment.equipmentPlannerGroup ? equipment.equipmentPlannerGroup.plannerGroupId : null;
      this.detailData.equipmentPlannerGroup = equipment.equipmentPlannerGroup;
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
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.cancel();
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.dataModel = {
      equipmentId: null,
      equipmentTaskId: null,
      equipmentPlannerGroupId: null,
      equipmentTaskType: {},
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
    this.selectedEquipmentTaskType = null;
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
