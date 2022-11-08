import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {OrderOperationService} from '../../../../../services/dto-services/maintenance-equipment/order-operation.service';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'order-operation-edit',
  templateUrl: './edit.component.html'
})
export class EditOrderOperationComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  @Input() maintenanceStatus: any;

  maintenanceActivityTypes;

  dataModel = {
    equipmentId: null,
    equipment: null,
    equipmentOperationId: null,
    actualWork: null,
    actualWorkUnit: null,
    work: null,
    workUnit: null,
    duration: null,
    durationUnit: null,
    finalCost: null,
    indexNo: null,
    maintenanceActivityType: null,
    maintenanceEmployeeId: null,
    resultNote: null,
    maintenanceOperationId: null, //id
    maintenanceOrderId: null,
    maintenanceOrderStatus: null,
    plannedFinishDate: null,
    plannedStartDate: null,
    actualFinishedDate: null,
    actualStartDate: null,
    planningPlantId: null,
    planningPlant: null,
    workstationId: null,
    workstation: null,
    costRate:null
  };
  detailData;

  fromOutStandToProcess = false;
  @Input('fromOutStandToProcess') set setprocess(fromOutStandToProcess) {
    this.fromOutStandToProcess = fromOutStandToProcess;
    if (this.fromOutStandToProcess) {
      this.dataModel.actualStartDate = new Date();
    }
  }

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _enumSvc: EnumService,
              private mStrategyService: OrderOperationService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  // this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    this.initialize(this.id);
    this._enumSvc.getMaintenanceActivityTypeEnum().then(result => this.maintenanceActivityTypes = result).catch(error => console.log(error));
  }

  setSelectedEquipmentOperation(equipmentOperation) {
    if (equipmentOperation) {
      this.dataModel.equipmentOperationId = equipmentOperation.equipmentOperationId;
    } else {
      this.dataModel.equipmentOperationId = null;
    }
  }
setSelectedEquipment(equipment) {
  if (equipment) {
    this.dataModel.equipmentId = equipment.equipmentId;
    // this.dataModel.workstationId = equipment.maintenanceWorkstation ? equipment.maintenanceWorkstation.workStationId : null;
  } else {
    this.dataModel.equipmentId = null;
  }
}



setSelectedWorkstation(event) {
  if (event) {
    this.dataModel.workstationId = event.workStationId;
  } else {
    this.dataModel.workstationId = null;
  }
}setSelectedPlant(event) {
  if (event) {
    this.dataModel.planningPlantId = event.plantId;
  } else {
    this.dataModel.planningPlantId = null;
  }
}


  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if (result) {
          if (result['equipment']) {
            this.dataModel.equipmentId = result['equipment'] ? result['equipment'].equipmentId : null;
            this.dataModel.equipment = result['equipment'];
          }
          if (result['equipmentOperation']) {
            this.dataModel.equipmentOperationId = result['equipmentOperation'] ? result['equipmentOperation'].equipmentOperationId : null;
          }
          if (result['actualWork']) {
            this.dataModel.actualWork = result['actualWork'];
          }
          if (result['actualWorkUnit']) {
            this.dataModel.actualWorkUnit = result['actualWorkUnit'];
          }
          if (result['work']) {
            this.dataModel.work = result['work'];
          }
          if (result['workUnit']) {
            this.dataModel.workUnit = result['workUnit'];
          }
          if (result['duration']) {
            this.dataModel.duration = result['duration'];
          }
          if (result['durationUnit']) {
            this.dataModel.durationUnit = result['durationUnit'];
          }
          if (result['finalCost']) {
            this.dataModel.finalCost = result['finalCost'];
          }
          if (result['costRate']) {
            this.dataModel.costRate = result['costRate'];
          }

          if (result['indexNo']) {
            this.dataModel.indexNo = result['indexNo'];
          }
          if (result['maintenanceOperationId']) {
            this.dataModel.maintenanceOperationId = result['maintenanceOperationId'];
          }
          if (result['maintenanceOrder']) {
            this.dataModel.maintenanceOrderId = result['maintenanceOrder'] ? result['maintenanceOrder'].maintenanceId : null;
            this.dataModel.maintenanceOrderStatus = result['maintenanceOrder'] ? result['maintenanceOrder'].maintenanceStatus : null;
          }
          if (result['plannedFinishDate']) {
            this.dataModel.plannedFinishDate = result['plannedFinishDate'] ? new Date(result['plannedFinishDate']) : null;
          }
          if (result['plannedStartDate']) {
            this.dataModel.plannedStartDate = result['plannedStartDate'] ? new Date(result['plannedStartDate']) : null;
          }
          if (result['actualFinishedDate']) {
            this.dataModel.actualFinishedDate = result['actualFinishedDate'] ? new Date(result['actualFinishedDate']) : null;
          }
          if (result['actualStartDate']) {
            this.dataModel.actualStartDate = new Date(result['actualStartDate']);
          }
          if (result['maintenanceActivityType']) {
            this.dataModel.maintenanceActivityType = result['maintenanceActivityType'];
          }
          if (result['equipmentOperation']) {
            this.dataModel.equipmentOperationId = result['equipmentOperation'] ? result['equipmentOperation'].equipmentOperationId : null;
          }
          if (result['planningPlant']) {
            this.dataModel.planningPlantId = result['planningPlant'] ? result['planningPlant'].plantId : null;
            this.dataModel.planningPlant = result['planningPlant'];
          }
          if (result['maintenanceEmployee']) {
            this.dataModel.maintenanceEmployeeId = result['maintenanceEmployee'].employeeId;
          }
          this.dataModel.resultNote = result['resultNote'];
          if (result['workstation']) {
            this.dataModel.workstationId = result['workstation'] ? result['workstation'].workStationId : null;
            this.dataModel.workstation = result['workstation'];
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    
    if (this.fromOutStandToProcess && !this.dataModel.maintenanceEmployeeId) {
      this.utilities.showWarningToast('employee-name-required');
      return ;
    }
    this.loaderService.showLoader();
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
      equipment: null,
      maintenanceActivityType: null,
      workstation: null,
      planningPlant: null,
      equipmentOperationId: null,
      actualWork: null,
      maintenanceEmployeeId: null,
      resultNote: null,
      actualWorkUnit: null,
      work: null,
      workUnit: null,
      duration: null,
      durationUnit: null,
      finalCost: null,
      maintenanceOrderStatus: null,
      actualFinishedDate: null,
      actualStartDate: null,
      indexNo: null,
      maintenanceOperationId: null, // id
      maintenanceOrderId: null,
      plannedFinishDate: null,
      plannedStartDate: null,
      planningPlantId: null,
      workstationId: null,
      costRate:null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
