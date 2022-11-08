import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {EquipmentOperationService} from '../../../../../services/dto-services/maintenance-equipment/equipment-operation.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'equipment-operation-new',
  templateUrl: './new.component.html'
})
export class NewEquipmentOperationComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    operationCode: null,
    operationDescription: null,
    plantId: null,
  };
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: EquipmentOperationService) {

  }

  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
  }

  save() {
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then((res: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
          this.saveAction.emit(res);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      operationCode: null,
      operationDescription: null,
      plantId: this.selectedPlant.plantId
    }
  }
}
