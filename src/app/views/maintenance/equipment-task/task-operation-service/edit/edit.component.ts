import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {TaskOperationServiceService} from '../../../../../services/dto-services/maintenance-equipment/task-operation-service.service';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'task-operation-service-edit',
  templateUrl: './edit.component.html'
})
export class EditTaskOperationServiceComponent implements OnInit {

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
    currency: null,
    equipmentTaskOperationExternalServiceId: null,
    equipmentTaskOperationId: null,
    externalServiceId: null,
    grossPrice: null,
    quantity: null,
    plantId: null,
    quantityUnit: null
  };
  detailData;

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
    // this.initialize(this.id);
  }

  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if (result) {
          if (result['currency']) {
            this.dataModel.currency = result['currency'];
          }
          if (result['grossPrice']) {
            this.dataModel.grossPrice = result['grossPrice'];
          }
          if (result['quantity']) {
            this.dataModel.quantity = result['quantity'];
          }
          if (result['quantityUnit']) {
            this.dataModel.quantityUnit = result['quantityUnit'];
          }
          if (result['equipmentTaskOperation']) {
            this.dataModel.equipmentTaskOperationId = result['equipmentTaskOperation'].equipmentTaskOperationId;
          }
          if (result['equipmentTaskOperationExternalServiceId']) {
            this.dataModel.equipmentTaskOperationExternalServiceId = result['equipmentTaskOperationExternalServiceId'];
          }
          if (result['externalService']) {
            this.dataModel.externalServiceId = result['externalService'].externalServiceId;
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedService(externalService) {
    if (externalService) {
      this.dataModel.externalServiceId = externalService.serviceId;
    } else {
      this.dataModel.externalServiceId = null;
    }
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
      currency: null,
      equipmentTaskOperationExternalServiceId: null,
      equipmentTaskOperationId: null,
      externalServiceId: null,
      grossPrice: null,
      plantId:this.dataModel.plantId,
      quantity: null,
      quantityUnit: null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
