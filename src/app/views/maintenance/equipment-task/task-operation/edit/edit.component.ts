import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {TaskOperationService} from '../../../../../services/dto-services/maintenance-equipment/task-operation.service';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'task-operation-edit',
  templateUrl: './edit.component.html'
})
export class EditTaskOperationComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel = {
    calculationKey: null,
    equipmentOperationId: null,
    equipmentTaskOperationId: null,
    equipmentTaskId: null,
    operationOrder: null,
    work: null,
    plantId: null,
    workUnit: null,
    duration: null,
    durationUnit: null
  };
  detailData;

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
    // this.initialize(this.id);
  }

  setSelectedEquipmentOperation(equipmentOperation) {
    if (equipmentOperation) {
      this.dataModel.equipmentOperationId = equipmentOperation.equipmentOperationId;
    } else {
      this.dataModel.equipmentOperationId = null;
    }
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if (result) {
          if (result['calculationKey']) {
            this.dataModel.calculationKey = result['calculationKey'];
          }
          if (result['equipmentTaskOperationId']) {
            this.dataModel.equipmentTaskOperationId = result['equipmentTaskOperationId'];
          }
          if (result['operationOrder']) {
            this.dataModel.operationOrder = result['operationOrder'];
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
          if (result['equipmentTask']) {
            this.dataModel.equipmentTaskId = result['equipmentTask'].equipmentTaskId;
          }
          if (result['equipmentOperation']) {
            this.dataModel.equipmentOperationId = result['equipmentOperation'].equipmentOperationId;
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
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
      calculationKey: null,
      equipmentOperationId: null,
      equipmentTaskOperationId: null,
      equipmentTaskId: null,
      operationOrder: null,
      work: null,
      plantId: this.dataModel.plantId,
      workUnit: null,
      duration: null,
      durationUnit: null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
