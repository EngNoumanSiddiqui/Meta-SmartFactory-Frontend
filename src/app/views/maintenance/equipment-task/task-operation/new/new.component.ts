import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {TaskOperationService} from '../../../../../services/dto-services/maintenance-equipment/task-operation.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'task-operation-new',
  templateUrl: './new.component.html'
})
export class NewTaskOperationComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  index = 1;
  dataModel = {
    calculationKey: null,
    equipmentTaskOperationId: null,
    equipmentOperationId: null,
    equipmentTaskId: null,
    operationOrder: null,
    work: null,
    plantId: null,
    workUnit: null,
    duration: null,
    durationUnit: null,
    costRate:null,
  };

  @Input() equipmentTaskId;
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: TaskOperationService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
  }

  setSelectedEquipmentOperation(equipmentOperation) {
    if (equipmentOperation) {
      this.dataModel.equipmentOperationId = equipmentOperation.equipmentOperationId;
    } else {
      this.dataModel.equipmentOperationId = null;
    }
  }

  save() {
    this.dataModel.equipmentTaskId = this.equipmentTaskId;
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.dataModel.equipmentTaskOperationId = result.equipmentTaskOperationId;
        this.index = 2;
        // setTimeout(() => {
        //   this.equipmentTaskId = null;
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
      calculationKey: null,
      equipmentTaskOperationId: null,
      equipmentOperationId: null,
      equipmentTaskId: null,
      operationOrder: null,
      work: null,
      plantId: this.dataModel.plantId,
      workUnit: null,
      duration: null,
      durationUnit: null,
      costRate: null
    }
  }
}
