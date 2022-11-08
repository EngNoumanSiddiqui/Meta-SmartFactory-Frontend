import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {TaskOperationServiceService} from '../../../../../services/dto-services/maintenance-equipment/task-operation-service.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'task-operation-service-new',
  templateUrl: './new.component.html'
})
export class NewTaskOperationServiceComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    currency: null,
    equipmentTaskOperationId: null,
    externalServiceId: null,
    grossPrice: null,
    plantId: null,
    quantity: null,
    quantityUnit: null
  };

  @Input() equipmentTaskOperationId;
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: TaskOperationServiceService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
  }

  setSelectedService(externalService) {
    if (externalService) {
      this.dataModel.externalServiceId = externalService.serviceId;
    } else {
      this.dataModel.externalServiceId = null;
    }
  }

  save() {
    this.dataModel.equipmentTaskOperationId = this.equipmentTaskOperationId;
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.equipmentTaskOperationId = null;
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      currency: null,
      equipmentTaskOperationId: null,
      externalServiceId: null,
      grossPrice: null,
      plantId: this.dataModel.plantId,
      quantity: null,
      quantityUnit: null
    }
  }
}
