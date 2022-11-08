

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../../../environments/environment';
import {EquipmentAbcIndicatorRequestDto} from '../../../../../dto/maintenance/equipment-abc-indicator.dto';
import {EquipmentAbcIndicatorService} from '../../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {UsersService} from '../../../../../services/users/users.service';

@Component({
  selector: 'abcindicator-new',
  templateUrl: './new.component.html'
})
export class NewAbcIndicatorComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  params = {
    dialog: {title: '', inputValue: '', visible: false}
  };
  modal = {active: false};
  dataModel: EquipmentAbcIndicatorRequestDto = new EquipmentAbcIndicatorRequestDto();
  selectedPlant: any;

  constructor(
    private _router: Router,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private equipmentService: EquipmentAbcIndicatorService,
    private _userSvc: UsersService) {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.dataModel.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {

  }
  save() {
    this.loaderService.showLoader();
    this.dataModel.equipmentAbcIndicatorId = '';
    this.equipmentService.save(this.dataModel)
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

  }
}
