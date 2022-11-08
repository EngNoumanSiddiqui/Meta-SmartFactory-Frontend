import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceOrderTypeService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'maintenance-order-type-new',
  templateUrl: './new.component.html'
})
export class NewMaintenanceOrderTypeComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    maintenanceOrderTypeName: null,
    maintenanceOrderType: null,
    plantId: null
  };
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mOrderTypeService: MaintenanceOrderTypeService) {

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
    this.mOrderTypeService.save(this.dataModel)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
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
      maintenanceOrderTypeName: null,
      maintenanceOrderType: null,
      plantId: this.dataModel.plantId
    }
  }
}
