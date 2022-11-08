import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {OrderOperationService} from '../../../../../services/dto-services/maintenance-equipment/order-operation.service';
import {environment} from '../../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
@Component({
  selector: 'order-operation-new',
  templateUrl: './new.component.html'
})
export class NewOrderOperationComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    equipmentId: null,
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
    maintenanceOperationId: null, // id
    maintenanceOrderId: null,
    maintenanceEmployeeId: null,
    resultNote: null,
    plannedFinishDate: null,
    plannedStartDate: null,
    actualFinishedDate: null,
    actualStartDate: null,
    planningPlantId: null,
    workstationId: null,
    costRate:null
  };

  fromOutStandToProcess = false;
  maintenanceActivityTypes;

  @Input() maintenanceOrderId;
  @Input('fromOutStandToProcess') set setprocess(fromOutStandToProcess) {
    this.fromOutStandToProcess = fromOutStandToProcess;
    if (this.fromOutStandToProcess) {
      this.dataModel.actualStartDate = new Date();
    }
  }
  selectedPlant: any;

  @Input('equipmentId') set seteqpmnt(equipmentId) {
    if (equipmentId) {
      this.dataModel.equipmentId = equipmentId;
    }
  }
  @Input('mainWorkStationId') set setwork(mainWorkStationId) {
    if (mainWorkStationId) {
      this.dataModel.workstationId = mainWorkStationId;
    }
  }
  @Input('maintenanceActivityType') set setmainactType(maintenanceActivityType) {
    if (maintenanceActivityType) {
      this.dataModel.maintenanceActivityType = maintenanceActivityType;
    }
  }
  @Input('planningPlantId') set setplant(planningPlantId) {
    if (planningPlantId) {
      this.dataModel.planningPlantId = planningPlantId;
    }
  }

  @Input() equipmentName;
  @Input() mainWorkStationName;


  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _enumSvc: EnumService,
              private _userSvc: UsersService,
              private mStrategyService: OrderOperationService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.planningPlantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    this._enumSvc.getMaintenanceActivityTypeEnum().then(result => this.maintenanceActivityTypes = result).catch(error => console.log(error));
  }

  setSelectedEquipmentOperation(equipmentOperation) {
    if (equipmentOperation) {
      this.dataModel.equipmentOperationId = equipmentOperation.equipmentOperationId;
    } else {
      this.dataModel.equipmentOperationId = null;
    }
  }  setSelectedEquipment(equipment) {
    if (equipment) {
      this.dataModel.equipmentId = equipment.equipmentId;
      this.equipmentName = equipment.equipmentName;
      // this.dataModel.workstationId = equipment.maintenanceWorkstation ? equipment.maintenanceWorkstation.workStationId : null;
    } else {
      this.dataModel.equipmentId = null;
    }
  }
  

  
  setSelectedWorkstation(event) {
    if (event) {
      this.dataModel.workstationId = event.workStationId;
      this.mainWorkStationName = event.workStationName;
    } else {
      this.dataModel.workstationId = null;
      this.mainWorkStationName = null;
    }
  }setSelectedPlant(event) {
    if (event) {
      this.dataModel.planningPlantId = event.plantId;
    } else {
      this.dataModel.planningPlantId = null;
    }
  }

  save() {
    this.dataModel.maintenanceOrderId = this.maintenanceOrderId;
    
    if (this.fromOutStandToProcess && !this.dataModel.maintenanceEmployeeId) {
      this.utilities.showWarningToast('employee-name-required');
      return ;
    }
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.maintenanceOrderId = null;
          this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      equipmentOperationId: null,
      work: null,
      workUnit: null,
      actualWork: null,
      actualWorkUnit: null,
      duration: null,
      durationUnit: null,
      finalCost: null,
      equipmentId: null,
      indexNo: null,
      maintenanceEmployeeId: null,
      resultNote: null,
      maintenanceActivityType: null,
      maintenanceOperationId: null, // id
      maintenanceOrderId: null,
      plannedFinishDate: null,
      plannedStartDate: null,
      actualStartDate: null,
      actualFinishedDate: null,
      planningPlantId: null,
      workstationId: null,
      costRate:null
    }
  }
}
