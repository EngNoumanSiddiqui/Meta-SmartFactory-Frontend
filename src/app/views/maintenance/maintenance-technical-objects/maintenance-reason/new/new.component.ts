import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceReasonService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-reason.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'maintenance-reason-new',
  templateUrl: './new.component.html'
})
export class NewMaintenanceReasonComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    code: null,
    description: null,
    plantId: null,
  };
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mReasonService: MaintenanceReasonService) {

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
    this.mReasonService.save(this.dataModel)
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
      code: null,
      description: null,
      plantId: this.dataModel.plantId,
    }
  }
}
