import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {ExternalServiceService} from '../../../../../services/dto-services/maintenance-equipment/external-service.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'external-service-new',
  templateUrl: './new.component.html'
})
export class NewExternalServiceComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    companyAddress: null,
    phone: null,
    serviceCode: null,
    plantId: null,
    serviceName: null,
    taxNumber: null
  };
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: ExternalServiceService) {

  }

  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    } else {
      this.dataModel.plantId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
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
      companyAddress: null,
      phone: null,
      plantId: this.dataModel.plantId,
      serviceCode: null,
      serviceName: null,
      taxNumber: null
    }
  }
}
